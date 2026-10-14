import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './config';

export const SERVICE_ROLE_NOT_CONFIGURED = 'Server analysis is not configured. Set SUPABASE_SERVICE_ROLE_KEY (server-only) to record trust scores.';

// Server-only client. Never import this from a 'use client' module: the
// service role bypasses row level security. Route handlers must verify the
// caller with the cookie-bound client before using it on their behalf.
export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error(SERVICE_ROLE_NOT_CONFIGURED);
  return createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
