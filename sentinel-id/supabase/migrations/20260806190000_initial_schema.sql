create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  job_title text,
  department text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  fingerprint text not null,
  device_name text,
  is_known boolean not null default false,
  certificate_validation text not null default 'UNKNOWN',
  mfa_enabled boolean not null default false,
  mfa_method text,
  bypass_attempts_24h integer not null default 0 check (bypass_attempts_24h >= 0),
  last_seen_at timestamptz not null default now(),
  unique (user_id, fingerprint)
);

create table public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  device_id uuid references public.devices(id) on delete set null,
  session_id text not null unique,
  ip_address inet,
  location text,
  status text not null check (status in ('APPROVED', 'FLAGGED', 'BLOCKED', 'FAILED')),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table public.trust_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  login_event_id uuid references public.login_events(id) on delete set null,
  score smallint not null check (score between 0 and 100),
  risk_level text not null check (risk_level in ('TRUSTED', 'REVIEW_REQUIRED', 'BLOCKED')),
  confidence numeric(4,3) not null check (confidence between 0 and 1),
  factors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.security_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  login_event_id uuid references public.login_events(id) on delete set null,
  severity text not null check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  alert_type text not null,
  description text not null,
  action text,
  status text not null default 'OPEN' check (status in ('OPEN', 'ACKNOWLEDGED', 'RESOLVED')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.blockchain_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  trust_score_id uuid references public.trust_scores(id) on delete set null,
  event_type text not null,
  chain text,
  transaction_hash text unique,
  payload_hash text,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'FAILED')),
  created_at timestamptz not null default now()
);

create index login_events_user_occurred_at_idx on public.login_events(user_id, occurred_at desc);
create index trust_scores_user_created_at_idx on public.trust_scores(user_id, created_at desc);
create index security_alerts_user_created_at_idx on public.security_alerts(user_id, created_at desc);
create index devices_user_last_seen_at_idx on public.devices(user_id, last_seen_at desc);

alter table public.users enable row level security;
alter table public.devices enable row level security;
alter table public.login_events enable row level security;
alter table public.trust_scores enable row level security;
alter table public.security_alerts enable row level security;
alter table public.blockchain_logs enable row level security;

create policy "users can read their profile" on public.users for select using (auth.uid() = id);
create policy "users can create their profile" on public.users for insert with check (auth.uid() = id);
create policy "users can update their profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "users can read own devices" on public.devices for select using (auth.uid() = user_id);
create policy "users can read own login events" on public.login_events for select using (auth.uid() = user_id);
create policy "users can read own trust scores" on public.trust_scores for select using (auth.uid() = user_id);
create policy "users can read own alerts" on public.security_alerts for select using (auth.uid() = user_id);
create policy "users can read own blockchain logs" on public.blockchain_logs for select using (auth.uid() = user_id);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users for each row execute procedure public.set_updated_at();
