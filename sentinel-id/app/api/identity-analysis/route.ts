import { NextResponse } from 'next/server';
import { getSupabaseSetupError } from '@/lib/supabase/errors';
import { createClient } from '@/lib/supabase/server';
import { ensureProfile } from '@/repositories/profileRepository';
import { analyzeIdentity } from '@/services/identityAnalysisService';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await ensureProfile(supabase, user);
    return NextResponse.json({ data: await analyzeIdentity(supabase, user.id) }, { status: 201 });
  } catch (error) {
    console.error('Identity analysis failed', error);
    return NextResponse.json({ error: getSupabaseSetupError(error, 'Unable to complete identity analysis.') }, { status: 500 });
  }
}
