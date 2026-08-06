import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function ensureProfile(client: SupabaseClient, user: User) {
  const { data, error } = await client
    .from('users')
    .upsert({ id: user.id, email: user.email ?? '', full_name: user.user_metadata.full_name ?? '' }, { onConflict: 'id' })
    .select('full_name, email, job_title, department')
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(client: SupabaseClient, userId: string, profile: { fullName: string; jobTitle: string; department: string }) {
  const { data, error } = await client
    .from('users')
    .update({ full_name: profile.fullName, job_title: profile.jobTitle, department: profile.department })
    .eq('id', userId)
    .select('full_name, email, job_title, department')
    .single();
  if (error) throw error;
  return data;
}
