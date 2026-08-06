import type { SupabaseClient } from '@supabase/supabase-js';
import { recordOnChainAudit } from './auditService';

export async function anchorLedgerEntry(client: SupabaseClient, entry: { id: string; score: number; riskLevel: string; decision: string; previousHash?: string | null }) {
  const result = await recordOnChainAudit({ ...entry, trustScore: entry.score });
  const { error } = await client.from('blockchain_logs').update({
    transaction_hash: result.transactionHash,
    polygon_transaction_hash: result.transactionHash,
    polygon_block_number: result.blockNumber,
    polygon_network: result.network,
    polygon_confirmations: result.confirmations,
    polygon_status: result.status,
  }).eq('id', entry.id);
  if (error) throw error;
  return result;
}
