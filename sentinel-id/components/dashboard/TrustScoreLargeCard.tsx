'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface TrustScoreCardProps {
  score: number;
  riskLevel: string;
  confidenceLevel: number;
  onApprove?: () => void;
  onEscalate?: () => void;
  onBlock?: () => void;
}

export function TrustScoreLargeCard({
  score,
  riskLevel,
  confidenceLevel,
  onApprove,
  onEscalate,
  onBlock,
}: TrustScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const duration = 520;
    let frame = 0;
    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setDisplayScore(Math.round(score * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const getVerdictLabel = (riskLevel: string) => {
    if (riskLevel === 'LOW') return 'IDENTITY TRUSTED';
    if (riskLevel === 'HIGH') return 'IDENTITY BLOCKED';
    return 'REVIEW REQUIRED';
  };

  const getVerdictColor = (riskLevel: string) => {
    if (riskLevel === 'LOW') return 'text-green-500';
    if (riskLevel === 'HIGH') return 'text-red-500';
    return 'text-amber-500';
  };

  const getBackgroundColor = (riskLevel: string) => {
    if (riskLevel === 'LOW') return 'bg-green-500/10 border-green-500/30';
    if (riskLevel === 'HIGH') return 'bg-red-500/10 border-red-500/30';
    return 'bg-amber-500/10 border-amber-500/30';
  };

  const getVerdictIcon = (riskLevel: string) => {
    if (riskLevel === 'LOW')
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (riskLevel === 'HIGH') return <XCircle className="w-8 h-8 text-red-500" />;
    return <AlertCircle className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className={`col-span-full rounded-2xl border-2 p-12 ${getBackgroundColor(riskLevel)}`}>
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Main Trust Score Display */}
        <div className="text-center">
          <div className="mb-4 text-7xl font-bold tabular-nums">
            {Math.round(displayScore)}
          </div>
          <p className="text-lg text-foreground/70">Trust Score</p>
        </div>

        {/* Verdict Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3">
            {getVerdictIcon(riskLevel)}
            <span className={`text-2xl font-bold tracking-wide ${getVerdictColor(riskLevel)}`}>
              {getVerdictLabel(riskLevel)}
            </span>
          </div>
          <p className="text-sm text-foreground/60">
            Confidence Level: {(confidenceLevel * 100).toFixed(0)}%
          </p>
        </div>

        {/* Risk Assessment Summary */}
        <div className="w-full max-w-2xl rounded-lg bg-background/40 p-6">
          <p className="text-center text-sm leading-relaxed text-foreground/80">
            {riskLevel === 'LOW'
              ? 'This identity exhibits behavior consistent with baseline profile. Risk factors within acceptable thresholds. Session approved for standard processing.'
              : riskLevel === 'HIGH'
                ? 'Critical risk indicators detected. Session has been automatically blocked pending Tier 1 analyst review. Recommend immediate escalation to SOC command.'
                : 'Multiple anomalies detected requiring investigative review. Device, access patterns, or threat intelligence triggers identified. Requires analyst decision.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {riskLevel !== 'HIGH' && (
            <button
              onClick={onApprove}
              className="rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700 active:scale-95"
            >
              Approve Login
            </button>
          )}
          <button
            onClick={onEscalate}
            className="rounded-lg bg-amber-600 px-8 py-3 font-medium text-white transition-all hover:bg-amber-700 active:scale-95"
          >
            Escalate to Tier 2
          </button>
          <button
            onClick={onBlock}
            className="rounded-lg bg-red-600 px-8 py-3 font-medium text-white transition-all hover:bg-red-700 active:scale-95"
          >
            Block Identity
          </button>
        </div>
      </div>
    </div>
  );
}
