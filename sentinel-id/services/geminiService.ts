import type { TrustScoreResult } from '@/lib/trustScore/engine';

export interface AIExplanation { explanation: string; summary: string; recommendedAction: string; source: 'gemini' | 'fallback'; }

function fallback(result: TrustScoreResult): AIExplanation {
  const weakSignals = Object.entries(result.signals).filter(([, value]) => value < 75).map(([key]) => key.replace(/([A-Z])/g, ' $1'));
  return {
    explanation: `The deterministic score is ${result.score}/100. ${weakSignals.length ? `Lower confidence in ${weakSignals.join(', ')} requires attention.` : 'All evaluated signals are within expected thresholds.'}`,
    summary: `${result.riskLevel} risk assessment with a ${result.decision} recommendation.`,
    recommendedAction: result.decision,
    source: 'fallback',
  };
}

export async function explainAnalysis(result: TrustScoreResult, history: { total: number; blocked: number }): Promise<AIExplanation> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback(result);
  const prompt = `You explain an identity-security decision. Do not calculate or change the supplied score. Return strict JSON with explanation, summary, recommendedAction. Score: ${result.score}; risk: ${result.riskLevel}; decision: ${result.decision}; signals: ${JSON.stringify(result.signals)}; risk factors: ${JSON.stringify(result.factors)}; historical logins: ${history.total}; blocked historical logins: ${history.blocked}. recommendedAction must be ALLOW, VERIFY, or BLOCK.`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Gemini request failed with ${response.status}`);
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no explanation');
    const parsed = JSON.parse(text) as Omit<AIExplanation, 'source'>;
    if (!parsed.explanation || !parsed.summary || !['ALLOW', 'VERIFY', 'BLOCK'].includes(parsed.recommendedAction)) throw new Error('Gemini response was invalid');
    return { ...parsed, source: 'gemini' };
  } catch {
    return fallback(result);
  }
}
