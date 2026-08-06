import type { SupabaseClient } from '@supabase/supabase-js';

export async function getDashboardRows(client: SupabaseClient, userId: string) {
  const [profile, login, score, device, alerts] = await Promise.all([
    client.from('users').select('id, email').eq('id', userId).single(),
    client.from('login_events').select('id, session_id, location, ip_address, occurred_at, status, metadata').eq('user_id', userId).order('occurred_at', { ascending: false }).limit(1).maybeSingle(),
    client.from('trust_scores').select('score, risk_level, decision, confidence, factors, signals, ai_explanation, ai_summary, ai_recommendation, ai_source, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    client.from('devices').select('is_known, certificate_validation, mfa_enabled, mfa_method, bypass_attempts_24h').eq('user_id', userId).order('last_seen_at', { ascending: false }).limit(1).maybeSingle(),
    client.from('security_alerts').select('id, severity, alert_type, description, action, status, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
  ]);
  for (const result of [profile, login, score, device, alerts]) if (result.error) throw result.error;
  return { profile: profile.data, login: login.data, score: score.data, device: device.data, alerts: alerts.data ?? [] };
}

export async function getAlerts(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from('security_alerts').select('id, severity, alert_type, description, action, status, created_at').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
