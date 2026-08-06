'use client';

import { Sidebar } from '@/components/Sidebar';
import { TrustScoreLargeCard } from '@/components/dashboard/TrustScoreLargeCard';
import {
  SessionRiskAssessment,
  AccessPatternAnalysis,
  MFAStatusIndicator,
  ImpossibleTravelDetection,
  DeviceFingerprintIntegrity,
  NetworkIntelligence,
  CryptographicVerification,
  ThreatIntelligenceMatches,
} from '@/components/dashboard/SOCMetricCards';
import { SuspiciousActivityTimeline } from '@/components/dashboard/SuspiciousActivityTimeline';
import { InvestigativeActionsPanel } from '@/components/dashboard/InvestigativeActionsPanel';
import { AIExplanationPanel } from '@/components/dashboard/AIExplanationPanel';
import { useEffect, useRef, useState } from 'react';
import { getDashboard } from '@/services/dashboardService';
import { requestIdentityAnalysis } from '@/services/identityAnalysisClient';
import type { DashboardData } from '@/lib/types';

export default function DashboardPage() {
  const [decision, setDecision] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const hasRequestedInitialAnalysis = useRef(false);

  useEffect(() => {
    getDashboard().then(async (dashboard) => {
      if (dashboard) setData(dashboard);
      else if (!hasRequestedInitialAnalysis.current) {
        hasRequestedInitialAnalysis.current = true;
        setData(await requestIdentityAnalysis());
      }
    }).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load dashboard.')).finally(() => setLoading(false));
  }, []);

  const handleApprove = () => {
    setDecision('APPROVED');
    setTimeout(() => setDecision(null), 3000);
  };

  const handleEscalate = async () => {
    setAnalyzing(true);
    try {
      const refreshed = await requestIdentityAnalysis();
      if (refreshed) setData(refreshed);
      setDecision('ESCALATED');
      setTimeout(() => setDecision(null), 3000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to analyze identity.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBlock = () => {
    setDecision('BLOCKED');
    setTimeout(() => setDecision(null), 3000);
  };

  if (loading) return <div className="min-h-screen bg-background"><Sidebar /><main className="p-4 text-foreground/60 lg:ml-64 lg:p-8">Loading identity data...</main></div>;
  if (error) return <div className="min-h-screen bg-background"><Sidebar /><main className="p-4 lg:ml-64 lg:p-8" role="alert"><p className="text-red-400">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">Retry</button></main></div>;
  if (!data) return <div className="min-h-screen bg-background"><Sidebar /><main className="p-4 text-foreground/60 lg:ml-64 lg:p-8">No identity assessment is available yet.</main></div>;
  const identity = data.identity;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="sentinel-enter mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Identity Verification Dashboard</h1>
          <p className="text-foreground/60">SOC Analyst Review - Identity ID: {identity.id}</p>
        </div>

        {/* Decision Notification */}
        {decision && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium ${
              decision === 'APPROVED'
                ? 'bg-green-500/20 text-green-400'
                : decision === 'BLOCKED'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {decision === 'APPROVED' && 'Analyst approval selected. Durable approval workflows are not configured.'}
            {decision === 'BLOCKED' && 'Analyst block selected. Durable block workflows are not configured.'}
            {decision === 'ESCALATED' && 'Identity analysis was refreshed and recorded in the SecureChain audit log.'}
          </div>
        )}

        {/* Trust Score - Large Centerpiece */}
        <div className="mb-12 grid grid-cols-1">
          <TrustScoreLargeCard
            score={data.identity.trustScore}
            riskLevel={data.identity.riskLevel}
            confidenceLevel={data.identity.confidenceLevel}
            onApprove={handleApprove}
            onEscalate={handleEscalate}
            onBlock={handleBlock}
          />
        </div>

        {analyzing && <p className="mb-6 text-sm text-blue-400">Running identity analysis...</p>}
        <AIExplanationPanel explanation={data.aiExplanation} />

        {/* Current Session Information */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Current Session Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="sentinel-surface rounded-lg border border-slate-500/30 bg-slate-500/5 p-4">
              <p className="text-xs text-foreground/60">Session ID</p>
              <p className="mt-2 font-mono text-sm text-blue-400">{data.session?.sessionId ?? 'No session recorded'}</p>
            </div>
            <div className="sentinel-surface rounded-lg border border-slate-500/30 bg-slate-500/5 p-4">
              <p className="text-xs text-foreground/60">Location</p>
              <p className="mt-2 text-sm text-foreground">{data.session?.location ?? 'Unknown'}</p>
            </div>
            <div className="sentinel-surface rounded-lg border border-slate-500/30 bg-slate-500/5 p-4">
              <p className="text-xs text-foreground/60">IP Address</p>
              <p className="mt-2 font-mono text-sm text-foreground">{data.session?.ipAddress ?? 'Unknown'}</p>
            </div>
            <div className="sentinel-surface rounded-lg border border-slate-500/30 bg-slate-500/5 p-4">
              <p className="text-xs text-foreground/60">Timestamp</p>
              <p className="mt-2 text-sm text-foreground">{data.session?.timestamp ?? 'No session recorded'}</p>
            </div>
          </div>
        </div>

        {/* Risk Factors & Security Metrics */}
        <h2 className="mb-4 text-xl font-semibold text-foreground">Security Analysis</h2>
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SessionRiskAssessment risks={data.risks} />
          <ImpossibleTravelDetection score={data.signals.locationIntelligence} />
          <AccessPatternAnalysis signals={data.signals} />
          <MFAStatusIndicator mfaData={data.mfa} />
          <DeviceFingerprintIntegrity deviceData={data.device} />
          <NetworkIntelligence session={data.session} score={data.signals.threatIntelligence} />
          <CryptographicVerification hasSession={Boolean(data.session)} />
          <ThreatIntelligenceMatches threats={data.threats} />
        </div>

        {/* Activity & Actions */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SuspiciousActivityTimeline activities={data.activities} />
          <InvestigativeActionsPanel actions={data.actions} />
        </div>
      </main>
    </div>
  );
}
