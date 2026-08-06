'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { getLedger } from '@/services/ledgerService';
import type { LedgerEntry } from '@/lib/types';

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { getLedger().then(setEntries).catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load ledger.')).finally(() => setLoading(false)); }, []);
  return <div className="min-h-screen bg-background"><Sidebar /><main className="p-4 lg:ml-64 lg:p-8"><div className="mb-8 sentinel-enter"><h1 className="mb-2 text-3xl font-bold text-foreground">SecureChain Ledger</h1><p className="text-foreground/60">Tamper-evident identity analysis audit trail</p></div>{loading && <p className="text-foreground/60">Loading ledger entries...</p>}{error && <p role="alert" className="text-red-400">{error}</p>}{!loading && !error && entries.length === 0 && <p className="text-foreground/60">No audit entries found.</p>}<div className="space-y-3">{entries.map((entry) => <div key={entry.id} className="sentinel-surface rounded-lg border border-slate-500/30 bg-slate-500/5 p-4"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row"><div><p className="font-medium text-foreground">Analysis #{entry.chain_index} - {entry.decision}</p><p className="mt-1 text-sm text-foreground/70">Score {entry.score} | {entry.risk_level} risk | {entry.status}</p><p className="mt-3 break-all font-mono text-xs text-blue-400">Hash: {entry.entry_hash}</p><p className="mt-1 break-all font-mono text-xs text-foreground/50">Previous: {entry.previous_hash ?? 'GENESIS'}</p><p className="mt-3 break-all font-mono text-xs text-blue-400">Transaction: {entry.polygon_transaction_hash ?? 'Awaiting Polygon Amoy deployment'}</p><p className="mt-1 text-xs text-foreground/60">Block: {entry.polygon_block_number ?? 'Pending'} | Network: {entry.polygon_network ?? 'Polygon Amoy'} | Confirmations: {entry.polygon_confirmations ?? 0} | Status: {entry.polygon_status ?? 'NOT_SUBMITTED'}</p></div><p className="whitespace-nowrap text-xs text-foreground/60">{new Date(entry.created_at).toLocaleString()}</p></div></div>)}</div></main></div>;
}
