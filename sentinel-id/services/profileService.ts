import { apiRequest } from '@/lib/api';
import type { UserProfile } from '@/lib/types';

export const getProfile = () => apiRequest<UserProfile>('/api/profile');
export const updateProfile = (profile: Omit<UserProfile, 'email'>) => apiRequest<UserProfile>('/api/profile', { method: 'PATCH', body: JSON.stringify(profile) });
