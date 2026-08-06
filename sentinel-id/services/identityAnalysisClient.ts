import { apiRequest } from '@/lib/api';
import type { DashboardData } from '@/lib/types';

export async function requestIdentityAnalysis() {
  await apiRequest('/api/identity-analysis', { method: 'POST', body: JSON.stringify({}) });
  return apiRequest<DashboardData | null>('/api/dashboard');
}
