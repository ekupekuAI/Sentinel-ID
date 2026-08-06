import type { SupabaseClient } from '@supabase/supabase-js';
import { calculateTrustScore, type SecuritySignals } from '@/lib/trustScore/engine';
import { getAnalysisContext, recordAnalysis } from '@/repositories/analysisRepository';
import { explainAnalysis } from '@/services/geminiService';

export async function analyzeIdentity(client: SupabaseClient, userId: string) {
  const context = await getAnalysisContext(client, userId);
  const metadata = (context.logins[0]?.metadata ?? {}) as Record<string, unknown>;
  const criticalAlerts = context.alerts.filter((alert) => alert.severity === 'CRITICAL').length;
  const blocked = context.logins.filter((login) => login.status === 'BLOCKED' || login.status === 'FAILED').length;
  const total = context.logins.length;
  const baseSignals: SecuritySignals = {
    deviceTrust: context.device ? (context.device.is_known ? 90 : 55) - (context.device.bypass_attempts_24h * 10) : 50,
    behaviorPattern: typeof metadata.behaviorScore === 'number' ? metadata.behaviorScore : 70,
    locationIntelligence: typeof metadata.locationScore === 'number' ? metadata.locationScore : 70,
    threatIntelligence: Math.max(0, 90 - criticalAlerts * 35 - context.alerts.filter((alert) => alert.severity === 'HIGH').length * 15),
    historicalLoginPattern: total ? Math.round(((total - blocked) / total) * 100) : 70,
  };
  const result = calculateTrustScore(baseSignals);
  const explanation = await explainAnalysis(result, { total, blocked });
  const persisted = await recordAnalysis(client, userId, result, explanation);
  return { ...result, explanation, analyzedAt: persisted.analyzed_at, ledger: persisted };
}
