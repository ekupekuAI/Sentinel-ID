import type { DashboardData } from '@/lib/types';
import { Sparkles } from 'lucide-react';

export function AIExplanationPanel({ explanation }: { explanation: DashboardData['aiExplanation'] }) {
  if (!explanation) return null;
  return (
    <section className="mb-8 rounded-xl border border-slate-500/30 bg-slate-500/5 p-6">
      <div className="mb-4 flex items-center gap-3"><Sparkles className="h-5 w-5 text-blue-400" /><h2 className="text-xl font-semibold text-foreground">AI Security Explanation</h2></div>
      <p className="text-sm leading-relaxed text-foreground/80">{explanation.explanation}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2"><div><p className="text-foreground/60">Risk Summary</p><p className="mt-1 text-foreground">{explanation.summary}</p></div><div><p className="text-foreground/60">Recommended Action</p><p className="mt-1 font-medium text-blue-400">{explanation.recommendedAction}</p></div></div>
    </section>
  );
}
