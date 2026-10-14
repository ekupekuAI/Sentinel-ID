import type { SupabaseClient, User } from '@supabase/supabase-js';

// The on_auth_user_created trigger normally creates the row; this only
// back-fills it. It must never update an existing row: the old upsert reset
// full_name to the auth metadata value on every dashboard load, erasing edits
// made in Settings.
export async function ensureProfile(client: SupabaseClient, user: User) {
  const existing = await client.from('users').select('full_name, email, job_title, department').eq('id', user.id).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data;
  const { data, error } = await client
    .from('users')
    .insert({ id: user.id, email: user.email ?? '', full_name: user.user_metadata?.full_name ?? '' })
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
