export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TrustDecision = 'ALLOW' | 'VERIFY' | 'BLOCK';

export interface SecuritySignals {
  deviceTrust: number;
  behaviorPattern: number;
  locationIntelligence: number;
  threatIntelligence: number;
  historicalLoginPattern: number;
}

export interface TrustScoreResult {
  score: number;
  riskLevel: RiskLevel;
  decision: TrustDecision;
  confidence: number;
  signals: SecuritySignals;
  factors: Array<{ id: string; description: string; detail: string; confidence: number }>;
}

const weights: Record<keyof SecuritySignals, number> = {
  deviceTrust: 0.3,
  behaviorPattern: 0.25,
  locationIntelligence: 0.2,
  threatIntelligence: 0.15,
  historicalLoginPattern: 0.1,
};

function clamp(value: number) { return Math.min(100, Math.max(0, Math.round(value))); }

export function calculateTrustScore(signals: SecuritySignals): TrustScoreResult {
  const normalized = Object.fromEntries(Object.entries(signals).map(([key, value]) => [key, clamp(value)])) as unknown as SecuritySignals;
  const score = clamp(Object.entries(weights).reduce((total, [key, weight]) => total + normalized[key as keyof SecuritySignals] * weight, 0));
  const riskLevel: RiskLevel = score >= 75 ? 'LOW' : score >= 45 ? 'MEDIUM' : 'HIGH';
  const decision: TrustDecision = score >= 75 ? 'ALLOW' : score >= 45 ? 'VERIFY' : 'BLOCK';
  const factors = Object.entries(normalized)
    .filter(([, value]) => value < 75)
    .sort(([, left], [, right]) => left - right)
    .map(([key, value]) => ({
      id: `signal-${key}`,
      description: key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()),
      detail: `Signal confidence is ${value}/100.`,
      confidence: value / 100,
    }));
  return { score, riskLevel, decision, confidence: Number((0.65 + factors.length * 0.07).toFixed(2)), signals: normalized, factors };
}
