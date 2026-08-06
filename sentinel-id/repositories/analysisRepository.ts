import type { SupabaseClient } from '@supabase/supabase-js';
import type { TrustScoreResult } from '@/lib/trustScore/engine';
import type { AIExplanation } from '@/services/geminiService';

export async function getAnalysisContext(client: SupabaseClient, userId: string) {
  const [device, logins, alerts] = await Promise.all([
    client.from('devices').select('is_known, certificate_validation, mfa_enabled, bypass_attempts_24h').eq('user_id', userId).order('last_seen_at', { ascending: false }).limit(1).maybeSingle(),
    client.from('login_events').select('status, metadata').eq('user_id', userId).order('occurred_at', { ascending: false }).limit(20),
    client.from('security_alerts').select('severity').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
  ]);
  for (const result of [device, logins, alerts]) if (result.error) throw result.error;
  return { device: device.data, logins: logins.data ?? [], alerts: alerts.data ?? [] };
}

export async function recordAnalysis(client: SupabaseClient, userId: string, result: TrustScoreResult, explanation: AIExplanation) {
  const { data, error } = await client.rpc('record_identity_analysis', {
    p_user_id: userId, p_score: result.score, p_risk_level: result.riskLevel, p_decision: result.decision,
    p_confidence: result.confidence, p_factors: result.factors, p_signals: result.signals,
    p_ai_explanation: explanation.explanation, p_ai_summary: explanation.summary,
    p_ai_recommendation: explanation.recommendedAction, p_ai_source: explanation.source,
  });
  if (error) throw error;
  return (data as Array<{ trust_score_id: string; analyzed_at: string; ledger_id: string; entry_hash: string; previous_hash: string | null; status: string }>)[0];
}

export async function getLedgerEntries(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from('blockchain_logs').select('id, created_at, score, risk_level, decision, entry_hash, previous_hash, status, chain_index, polygon_transaction_hash, polygon_block_number, polygon_network, polygon_confirmations, polygon_status').eq('user_id', userId).order('chain_index', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
