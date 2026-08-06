'use client';

import { Sidebar } from '@/components/Sidebar';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAlerts } from '@/services/alertsService';
import type { SecurityAlert } from '@/lib/types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'RESOLVED'>('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getAlerts().then(setAlerts).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load alerts.')).finally(() => setLoading(false));
  }, []);
  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (severity === 'HIGH') return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    if (severity === 'MEDIUM') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  const getSeverityBadgeColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-500/20 text-red-400';
    if (severity === 'HIGH') return 'bg-orange-500/20 text-orange-400';
    if (severity === 'MEDIUM') return 'bg-amber-500/20 text-amber-400';
    return 'bg-blue-500/20 text-blue-400';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'CRITICAL') return <XCircle className="h-5 w-5" />;
    if (severity === 'HIGH') return <AlertTriangle className="h-5 w-5" />;
    return <Clock className="h-5 w-5" />;
  };

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const mediumCount = alerts.filter(a => a.severity === 'MEDIUM').length;
  const visibleAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === 'ALL' || (filter === 'RESOLVED' ? alert.status === 'RESOLVED' : alert.severity === filter);
    const searchable = `${alert.type} ${alert.description} ${alert.identity} ${alert.action}`.toLowerCase();
    return matchesFilter && searchable.includes(query.trim().toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Security Alerts</h1>
          <p className="text-foreground/60">Real-time threat and anomaly detection</p>
        </div>

        {/* Alert Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground/60">Critical Alerts</p>
                <p className="mt-2 text-3xl font-bold text-red-400">{criticalCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground/60">High Priority</p>
                <p className="mt-2 text-3xl font-bold text-orange-400">{highCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground/60">Medium Priority</p>
                <p className="mt-2 text-3xl font-bold text-amber-400">{mediumCount}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </div>
          <div className="rounded-lg border border-slate-500/30 bg-slate-500/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground/60">Total Alerts (24h)</p>
                <p className="mt-2 text-3xl font-bold text-blue-400">{alerts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button onClick={() => setFilter('ALL')} className={`rounded-lg px-4 py-2 text-sm font-medium border ${filter === 'ALL' ? 'border-blue-500/30 bg-blue-600/20 text-blue-400' : 'border-slate-500/20 bg-slate-800/50 text-foreground/60 hover:bg-slate-800'}`}>
            All Alerts
          </button>
          <button onClick={() => setFilter('CRITICAL')} className={`rounded-lg px-4 py-2 text-sm font-medium border ${filter === 'CRITICAL' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-slate-500/20 bg-slate-800/50 text-foreground/60 hover:bg-slate-800'}`}>
            Critical
          </button>
          <button onClick={() => setFilter('HIGH')} className={`rounded-lg px-4 py-2 text-sm font-medium border ${filter === 'HIGH' ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' : 'border-slate-500/20 bg-slate-800/50 text-foreground/60 hover:bg-slate-800'}`}>
            High Priority
          </button>
          <button onClick={() => setFilter('RESOLVED')} className={`rounded-lg px-4 py-2 text-sm font-medium border ${filter === 'RESOLVED' ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-slate-500/20 bg-slate-800/50 text-foreground/60 hover:bg-slate-800'}`}>
            Resolved
          </button>
          <div className="w-full sm:ml-auto sm:w-auto">
            <input
              type="text"
              placeholder="Search alerts..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="rounded-lg bg-slate-800/50 px-4 py-2 text-sm text-foreground placeholder-slate-400 border border-slate-500/20 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {loading && <p className="text-foreground/60">Loading alerts...</p>}
          {error && <p role="alert" className="text-red-400">{error}</p>}
          {!loading && !error && visibleAlerts.length === 0 && <p className="text-foreground/60">No alerts match the current filters.</p>}
          {visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`sentinel-surface rounded-lg border p-4 transition-all hover:shadow-lg ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0">{getSeverityIcon(alert.severity)}</div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{alert.type}</h3>
                        <span className={`rounded px-2 py-1 text-xs font-medium ${getSeverityBadgeColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground/70">{alert.description}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-foreground/60">
                        <span>
                          <strong>Identity:</strong> {alert.identity}
                        </span>
                        <span>
                          <strong>Action:</strong> {alert.action}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-foreground/60">{alert.timestamp}</p>
                      <p className="mt-2 text-xs font-mono text-foreground/50">{alert.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
