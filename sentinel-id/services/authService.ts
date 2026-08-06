import { createClient } from '@/lib/supabase/client';
import { signInSchema } from '@/lib/validation';

export async function signIn(credentials: { email: string; password: string }) {
  const values = signInSchema.parse(credentials);
  const { error } = await createClient().auth.signInWithPassword(values);
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await createClient().auth.signOut();
  if (error) throw new Error(error.message);
}
