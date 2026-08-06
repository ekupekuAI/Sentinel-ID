'use client';

import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Action {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action: string;
  description: string;
  estimatedTime: string;
}

export function InvestigativeActionsPanel({ actions }: { actions: Action[] }) {
  const getPriorityColor = (priority: string) => {
    if (priority === 'HIGH') return 'bg-red-500/10 border-red-500/30';
    if (priority === 'MEDIUM') return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-blue-500/10 border-blue-500/30';
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === 'HIGH') return 'text-red-400';
    if (priority === 'MEDIUM') return 'text-amber-400';
    return 'text-blue-400';
  };

  return (
    <div className="rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
      <div className="mb-6 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-slate-400" />
        <h3 className="text-sm font-semibold text-foreground">Recommended Investigative Actions</h3>
      </div>
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className={`rounded-lg border p-4 ${getPriorityColor(action.priority)}`}>
            <div className="flex items-start gap-3">
              <CheckCircle className={`mt-1 h-5 w-5 flex-shrink-0 ${getPriorityLabel(action.priority)}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{action.action}</p>
                    <p className="mt-1 text-sm text-foreground/70">{action.description}</p>
                  </div>
                  <span className={`whitespace-nowrap text-xs font-medium ${getPriorityLabel(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-foreground/60">
                  <Clock className="h-3 w-3" />
                  {action.estimatedTime}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
