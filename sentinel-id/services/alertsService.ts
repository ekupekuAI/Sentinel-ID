import { apiRequest } from '@/lib/api';
import type { SecurityAlert } from '@/lib/types';

export const getAlerts = () => apiRequest<SecurityAlert[]>('/api/alerts');
