create extension if not exists pgcrypto;

alter table public.trust_scores add column decision text check (decision in ('ALLOW', 'VERIFY', 'BLOCK'));
alter table public.trust_scores add column signals jsonb not null default '{}'::jsonb;
alter table public.trust_scores add column ai_explanation text;
alter table public.trust_scores add column ai_summary text;
alter table public.trust_scores add column ai_recommendation text check (ai_recommendation in ('ALLOW', 'VERIFY', 'BLOCK'));
alter table public.trust_scores add column ai_source text check (ai_source in ('gemini', 'fallback'));
alter table public.trust_scores drop constraint trust_scores_risk_level_check;
update public.trust_scores set risk_level = case risk_level when 'TRUSTED' then 'LOW' when 'REVIEW_REQUIRED' then 'MEDIUM' when 'BLOCKED' then 'HIGH' else risk_level end;
alter table public.trust_scores add constraint trust_scores_risk_level_check check (risk_level in ('LOW', 'MEDIUM', 'HIGH'));

alter table public.blockchain_logs add column score smallint check (score between 0 and 100);
alter table public.blockchain_logs add column risk_level text check (risk_level in ('LOW', 'MEDIUM', 'HIGH'));
alter table public.blockchain_logs add column decision text check (decision in ('ALLOW', 'VERIFY', 'BLOCK'));
alter table public.blockchain_logs add column entry_hash text;
alter table public.blockchain_logs add column previous_hash text;
alter table public.blockchain_logs add column chain_index bigint;
alter table public.blockchain_logs add constraint blockchain_logs_user_chain_index_key unique (user_id, chain_index);
alter table public.blockchain_logs add constraint blockchain_logs_user_entry_hash_key unique (user_id, entry_hash);

create or replace function public.append_securechain_entry(p_user_id uuid, p_trust_score_id uuid, p_score smallint, p_risk_level text, p_decision text)
returns table(id uuid, entry_hash text, previous_hash text, status text, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
declare previous_entry_hash text; next_index bigint; entry_timestamp timestamptz := now(); computed_hash text; inserted_id uuid;
begin
  if auth.uid() is distinct from p_user_id then raise exception 'not authorized'; end if;
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));
  select l.entry_hash, l.chain_index into previous_entry_hash, next_index from public.blockchain_logs l where l.user_id = p_user_id order by l.chain_index desc nulls last limit 1;
  next_index := coalesce(next_index, 0) + 1;
  computed_hash := encode(digest(concat_ws('|', p_user_id::text, p_trust_score_id::text, p_score::text, p_risk_level, p_decision, coalesce(previous_entry_hash, 'GENESIS'), next_index::text, entry_timestamp::text), 'sha256'), 'hex');
  insert into public.blockchain_logs (user_id, trust_score_id, event_type, score, risk_level, decision, entry_hash, previous_hash, chain_index, payload_hash, status, created_at)
  values (p_user_id, p_trust_score_id, 'IDENTITY_ANALYSIS', p_score, p_risk_level, p_decision, computed_hash, previous_entry_hash, next_index, computed_hash, 'CONFIRMED', entry_timestamp)
  returning blockchain_logs.id into inserted_id;
  return query select inserted_id, computed_hash, previous_entry_hash, 'CONFIRMED'::text, entry_timestamp;
end;
$$;

grant execute on function public.append_securechain_entry(uuid, uuid, smallint, text, text) to authenticated;

create or replace function public.record_identity_analysis(p_user_id uuid, p_score smallint, p_risk_level text, p_decision text, p_confidence numeric, p_factors jsonb, p_signals jsonb, p_ai_explanation text, p_ai_summary text, p_ai_recommendation text, p_ai_source text)
returns table(trust_score_id uuid, analyzed_at timestamptz, ledger_id uuid, entry_hash text, previous_hash text, status text)
language plpgsql security definer set search_path = '' as $$
declare score_id uuid; score_created_at timestamptz; prior_hash text; next_index bigint; timestamp_value timestamptz := now(); calculated_hash text; chain_id uuid;
begin
  if auth.uid() is distinct from p_user_id then raise exception 'not authorized'; end if;
  insert into public.trust_scores (user_id, score, risk_level, decision, confidence, factors, signals, ai_explanation, ai_summary, ai_recommendation, ai_source)
  values (p_user_id, p_score, p_risk_level, p_decision, p_confidence, p_factors, p_signals, p_ai_explanation, p_ai_summary, p_ai_recommendation, p_ai_source)
  returning trust_scores.id, trust_scores.created_at into score_id, score_created_at;
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));
  select l.entry_hash, l.chain_index into prior_hash, next_index from public.blockchain_logs l where l.user_id = p_user_id order by l.chain_index desc nulls last limit 1;
  next_index := coalesce(next_index, 0) + 1;
  calculated_hash := encode(digest(concat_ws('|', p_user_id::text, score_id::text, p_score::text, p_risk_level, p_decision, coalesce(prior_hash, 'GENESIS'), next_index::text, timestamp_value::text), 'sha256'), 'hex');
  insert into public.blockchain_logs (user_id, trust_score_id, event_type, score, risk_level, decision, entry_hash, previous_hash, chain_index, payload_hash, status, created_at)
  values (p_user_id, score_id, 'IDENTITY_ANALYSIS', p_score, p_risk_level, p_decision, calculated_hash, prior_hash, next_index, calculated_hash, 'CONFIRMED', timestamp_value)
  returning blockchain_logs.id into chain_id;
  return query select score_id, score_created_at, chain_id, calculated_hash, prior_hash, 'CONFIRMED'::text;
end;
$$;

grant execute on function public.record_identity_analysis(uuid, smallint, text, text, numeric, jsonb, jsonb, text, text, text, text) to authenticated;
