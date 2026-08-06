type SupabaseErrorLike = {
  code?: string;
  message?: string;
};

export function getSupabaseSetupError(error: unknown, fallback: string) {
  const cause = error as SupabaseErrorLike;
  const message = cause?.message ?? '';
  const migrationCodes = new Set(['42P01', '42703', '42883', 'PGRST202']);

  if (migrationCodes.has(cause?.code ?? '') || /record_identity_analysis|relation .* does not exist|column .* does not exist/i.test(message)) {
    return 'Database setup is incomplete. Apply every migration in supabase/migrations, then refresh the dashboard.';
  }

  if (/Supabase is not configured/i.test(message)) {
    return 'Supabase is not configured. Add the required NEXT_PUBLIC_SUPABASE environment variables and redeploy.';
  }

  return fallback;
}
