import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureProfile, updateProfile } from '@/repositories/profileRepository';
import { profileSchema } from '@/lib/validation';

function mapProfile(profile: { full_name: string; email: string; job_title: string | null; department: string | null }) {
  return { fullName: profile.full_name, email: profile.email, jobTitle: profile.job_title ?? '', department: profile.department ?? '' };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ data: mapProfile(await ensureProfile(supabase, user)) });
  } catch (error) {
    console.error('Profile request failed', error);
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const values = profileSchema.parse(await request.json());
    return NextResponse.json({ data: mapProfile(await updateProfile(supabase, user.id, values)) });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    if (error instanceof Error && 'issues' in error) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error('Profile update failed', error);
    return NextResponse.json({ error: 'Unable to update profile.' }, { status: 500 });
  }
}
