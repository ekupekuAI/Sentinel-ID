import type { DashboardData } from '@/lib/types';
import { getDashboardRows } from '@/repositories/securityRepository';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function getDashboardData(client: SupabaseClient, userId: string): Promise<DashboardData | null> {
  const { profile, login, score, device, alerts } = await getDashboardRows(client, userId);
  if (!profile || !score) return null;
  const factors = Array.isArray(score.factors) ? score.factors as DashboardData['risks'] : [];
  const signals = (score.signals && typeof score.signals === 'object' ? score.signals : {}) as Partial<DashboardData['signals']>;
  const activities = alerts.map((alert) => ({ timestamp: new Date(alert.created_at).toLocaleString(), event: alert.alert_type, result: alert.severity === 'CRITICAL' ? 'BLOCKED' : 'FLAGGED', reason: alert.description }));
  return {
    identity: { id: profile.id, email: profile.email, trustScore: score.score, riskLevel: score.risk_level, decision: score.decision ?? 'VERIFY', confidenceLevel: score.confidence },
    session: login ? { sessionId: login.session_id, location: login.location ?? 'Unknown', ipAddress: login.ip_address ?? 'Unknown', timestamp: new Date(login.occurred_at).toLocaleString() } : null,
    risks: factors,
    mfa: { enabled: device?.mfa_enabled ?? false, primaryMethod: device?.mfa_method ?? 'Not configured', bypassAttemptsLast24h: device?.bypass_attempts_24h ?? 0 },
    device: { known: device?.is_known ?? false, certificateValidation: device?.certificate_validation ?? 'UNKNOWN' },
    threats: alerts.filter((alert) => alert.severity === 'CRITICAL').map((alert) => ({ id: alert.id, type: alert.alert_type, description: alert.description, score: 100 })),
    activities,
    // Recommendation logic is intentionally deferred; actions are only rendered when stored data exists.
    actions: [],
    aiExplanation: score.ai_explanation && score.ai_summary && score.ai_recommendation
      ? { explanation: score.ai_explanation, summary: score.ai_summary, recommendedAction: score.ai_recommendation, source: score.ai_source ?? 'fallback' }
      : null,
    signals: {
      deviceTrust: signals.deviceTrust ?? 0,
      behaviorPattern: signals.behaviorPattern ?? 0,
      locationIntelligence: signals.locationIntelligence ?? 0,
      threatIntelligence: signals.threatIntelligence ?? 0,
      historicalLoginPattern: signals.historicalLoginPattern ?? 0,
    },
  };
}
