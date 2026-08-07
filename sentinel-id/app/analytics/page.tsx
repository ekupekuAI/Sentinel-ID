'use client';

import { Sidebar } from '@/components/Sidebar';
import { TrendingUp, PieChart as PieChartIcon, AlertTriangle, CheckCircle } from 'lucide-react';

function EmptyAnalyticsPanel({ label }: { label: string }) {
  return (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-slate-500/30 bg-slate-950/20 text-center">
      <p className="max-w-xs text-sm text-foreground/50">{label} will appear after analytics calculations are enabled.</p>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Identity Analytics & Reporting</h1>
          <p className="text-foreground/60">Historical trends, risk distribution, and compliance metrics</p>
          <p className="mt-2 text-xs text-amber-300">Live analytics calculations are not configured yet.</p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Avg Trust Score</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">--</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Blocked Sessions (24h)</p>
                <p className="mt-2 text-3xl font-bold text-red-400">--</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Threat Matches</p>
                <p className="mt-2 text-3xl font-bold text-orange-400">--</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-foreground/60">Compliance Score</p>
                <p className="mt-2 text-3xl font-bold text-green-400">--</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Trust Score Trend */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Trust Score Trend (7 Days)</h3>
            </div>
            <EmptyAnalyticsPanel label="Trust score trend" />
          </div>

          {/* Risk Category Breakdown */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <PieChartIcon className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Risk Category Distribution</h3>
            </div>
            <EmptyAnalyticsPanel label="Risk category distribution" />
          </div>
        </div>

        {/* Alerts Over Time & Compliance */}
        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Alerts Over Time */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Alerts by Hour</h3>
            </div>
            <EmptyAnalyticsPanel label="Alert activity" />
          </div>

          {/* Compliance Status */}
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-slate-400" />
              <h3 className="text-sm font-semibold text-foreground">Regulatory Compliance</h3>
            </div>
            <EmptyAnalyticsPanel label="Compliance metrics" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
          <h3 className="mb-6 text-sm font-semibold text-foreground">Performance Summary</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs text-foreground/60">Detection Accuracy</p>
              <p className="mt-2 text-2xl font-bold text-green-400">--</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">False Positives (24h)</p>
              <p className="mt-2 text-2xl font-bold text-yellow-400">--</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">Avg Response Time</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">--</p>
            </div>
            <div>
              <p className="text-xs text-foreground/60">System Uptime</p>
              <p className="mt-2 text-2xl font-bold text-green-400">--</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
