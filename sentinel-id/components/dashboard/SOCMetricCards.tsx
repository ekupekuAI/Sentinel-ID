'use client';

import { AlertTriangle, CheckCircle2, MapPin, Smartphone, Lock, Zap, Eye, TrendingUp } from 'lucide-react';
import type { DashboardData } from '@/lib/types';

interface MetricCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'INFO';
}

function MetricCard({ title, icon, children, severity = 'INFO' }: MetricCardProps) {
  const severityColors = {
    LOW: 'border-blue-500/30 bg-blue-500/5',
    MEDIUM: 'border-amber-500/30 bg-amber-500/5',
    HIGH: 'border-orange-500/30 bg-orange-500/5',
    CRITICAL: 'border-red-500/30 bg-red-500/5',
    INFO: 'border-slate-500/30 bg-slate-500/5',
  };

  return (
    <div className={`sentinel-surface rounded-xl border p-6 ${severityColors[severity]}`}>
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function SessionRiskAssessment({ risks }: { risks: DashboardData['risks'] }) {
  return (
    <MetricCard
      title="Session Risk Assessment"
      icon={<Zap className="h-5 w-5 text-yellow-400" />}
      severity={risks.length ? 'HIGH' : 'INFO'}
    >
      <div className="space-y-3">
        {risks.length === 0 && <p className="text-sm text-foreground/60">No elevated risk factors were recorded for this analysis.</p>}
        {risks.slice(0, 2).map((risk) => (
          <div key={risk.id} className="text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
              <div>
                <p className="font-medium text-red-300">{risk.description}</p>
                <p className="mt-1 text-xs text-foreground/60">{risk.detail}</p>
                <p className="mt-2 text-xs text-amber-400">Confidence: {(risk.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MetricCard>
  );
}

export function AccessPatternAnalysis({ signals }: { signals: DashboardData['signals'] }) {
  return (
    <MetricCard
      title="Access Pattern Analysis"
      icon={<TrendingUp className="h-5 w-5 text-purple-400" />}
      severity={signals.behaviorPattern < 45 ? 'HIGH' : signals.behaviorPattern < 75 ? 'MEDIUM' : 'LOW'}
    >
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-foreground/80">Behavior Signal</p>
          <p className="text-sm text-foreground/60">{signals.behaviorPattern}/100 confidence</p>
        </div>
        <div>
          <p className="text-foreground/80">Historical Pattern</p>
          <p className="text-sm text-foreground/60">{signals.historicalLoginPattern}/100 confidence</p>
        </div>
        <div>
          <p className="text-foreground/80">Assessment Basis</p>
          <p className="text-sm text-foreground/60">Derived from available login event history</p>
        </div>
      </div>
    </MetricCard>
  );
}

export function MFAStatusIndicator({ mfaData }: { mfaData: DashboardData['mfa'] }) {
  return (
    <MetricCard
      title="Multi-Factor Authentication Status"
      icon={<Lock className="h-5 w-5 text-green-400" />}
      severity={mfaData.bypassAttemptsLast24h > 0 ? 'HIGH' : 'LOW'}
    >
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground/80">MFA Enabled</span>
          {mfaData.enabled ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <span className="text-xs text-amber-300">Not configured</span>}
        </div>
        <div>
          <p className="text-foreground/80">Primary Method</p>
          <p className="text-sm text-foreground/60">{mfaData.primaryMethod}</p>
        </div>
        <div>
          <p className="text-foreground/80">Bypass Attempts (24h)</p>
          <p className={`text-sm ${mfaData.bypassAttemptsLast24h > 0 ? 'text-red-300' : 'text-green-300'}`}>
            {mfaData.bypassAttemptsLast24h} attempt(s)
          </p>
        </div>
      </div>
    </MetricCard>
  );
}

export function ImpossibleTravelDetection({ score }: { score: number }) {
  return (
    <MetricCard
      title="Impossible Travel Detection"
      icon={<MapPin className="h-5 w-5 text-red-400" />}
      severity={score < 45 ? 'HIGH' : score < 75 ? 'MEDIUM' : 'LOW'}
    >
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-foreground">Location Intelligence</p>
        </div>
        <div className="text-xs text-foreground/70">
          <p>Location confidence: {score}/100</p>
          <p className="mt-2">Location anomalies are calculated only from recorded login telemetry.</p>
        </div>
      </div>
    </MetricCard>
  );
}

export function DeviceFingerprintIntegrity({ deviceData }: { deviceData: DashboardData['device'] }) {
  return (
    <MetricCard
      title="Device Fingerprint Integrity"
      icon={<Smartphone className="h-5 w-5 text-orange-400" />}
      severity="MEDIUM"
    >
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-foreground/80">Device Status</p>
          <p className={`text-sm ${deviceData.known ? 'text-green-300' : 'text-orange-300'}`}>
            {deviceData.known ? 'Known Device' : 'Unknown Device'}
          </p>
        </div>
        <div>
          <p className="text-foreground/80">Device Telemetry</p>
          <p className="text-sm text-foreground/60">No browser fingerprint details are retained in the dashboard.</p>
        </div>
        <div>
          <p className="text-foreground/80">Certificate Validation</p>
          <p className={`text-sm ${deviceData.certificateValidation === 'VALID' ? 'text-green-300' : 'text-red-300'}`}>
            {deviceData.certificateValidation}
          </p>
        </div>
      </div>
    </MetricCard>
  );
}

export function NetworkIntelligence({ session, score }: { session: DashboardData['session']; score: number }) {
  return (
    <MetricCard
      title="Network Intelligence"
      icon={<Eye className="h-5 w-5 text-blue-400" />}
      severity={score < 45 ? 'HIGH' : score < 75 ? 'MEDIUM' : 'LOW'}
    >
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-foreground/80">IP Address</p>
          <p className="text-sm text-foreground/60">{session?.ipAddress ?? 'No network address recorded'}</p>
        </div>
        <div>
          <p className="text-foreground/80">Threat Intelligence Signal</p>
          <p className="text-sm text-foreground/60">{score}/100 confidence</p>
        </div>
        <div>
          <p className="text-foreground/80">Network Status</p>
          <p className="text-sm text-foreground/60">Based on recorded alerts and security events</p>
        </div>
      </div>
    </MetricCard>
  );
}

export function CryptographicVerification({ hasSession }: { hasSession: boolean }) {
  return (
    <MetricCard
      title="Cryptographic Verification Status"
      icon={<Lock className="h-5 w-5 text-green-400" />}
      severity={hasSession ? 'INFO' : 'LOW'}
    >
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-foreground/80">Digital Signature</span>
          <span className="text-xs text-foreground/60">Not supplied</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground/80">TLS Certificate</span>
          <span className="text-xs text-foreground/60">Not supplied</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground/80">Message Authentication</span>
          <span className="text-xs text-foreground/60">Not supplied</span>
        </div>
      </div>
    </MetricCard>
  );
}

export function ThreatIntelligenceMatches({ threats }: { threats: DashboardData['threats'] }) {
  return (
    <MetricCard
      title="Threat Intelligence Matches"
      icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
      severity={threats.length ? 'CRITICAL' : 'INFO'}
    >
      <div className="space-y-3">
        {threats.length === 0 && <p className="text-sm text-foreground/60">No critical threat intelligence matches were recorded.</p>}
        {threats.map((threat) => (
          <div key={threat.id} className="text-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-red-300">{threat.name || threat.type}</p>
                <p className="mt-1 text-xs text-foreground/60">{threat.description}</p>
              </div>
              <span className="whitespace-nowrap text-xs font-medium text-red-300">
                {(threat.confidence ? threat.confidence * 100 : threat.score ?? 0).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </MetricCard>
  );
}
