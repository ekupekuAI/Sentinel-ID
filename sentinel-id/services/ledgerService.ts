import { apiRequest } from '@/lib/api';
import type { LedgerEntry } from '@/lib/types';

export const getLedger = () => apiRequest<LedgerEntry[]>('/api/ledger');
