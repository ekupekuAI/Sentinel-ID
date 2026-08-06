'use client';

import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Activity {
  timestamp: string;
  event: string;
  result: string;
  reason: string;
}

export function SuspiciousActivityTimeline({ activities }: { activities: Activity[] }) {
  const getResultIcon = (result: string) => {
    if (result === 'BLOCKED') return <XCircle className="h-5 w-5 text-red-400" />;
    if (result === 'APPROVED') return <CheckCircle className="h-5 w-5 text-green-400" />;
    return <AlertTriangle className="h-5 w-5 text-amber-400" />;
  };

  const getResultColor = (result: string) => {
    if (result === 'BLOCKED') return 'bg-red-500/10 border-red-500/30';
    if (result === 'APPROVED') return 'bg-green-500/10 border-green-500/30';
    return 'bg-amber-500/10 border-amber-500/30';
  };

  return (
    <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Clock className="h-5 w-5 text-slate-400" />
        <h3 className="text-sm font-semibold text-foreground">Recent Suspicious Activities</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className={`rounded-lg border p-4 ${getResultColor(activity.result)}`}>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">{getResultIcon(activity.result)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{activity.event}</p>
                  <span className="text-xs font-medium text-foreground/60">{activity.timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-foreground/70">{activity.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
