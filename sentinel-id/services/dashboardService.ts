import { apiRequest } from '@/lib/api';
import type { DashboardData } from '@/lib/types';

export const getDashboard = () => apiRequest<DashboardData | null>('/api/dashboard');
