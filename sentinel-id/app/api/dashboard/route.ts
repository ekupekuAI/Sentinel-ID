import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardData } from '@/services/securityService';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ data: await getDashboardData(supabase, user.id) });
  } catch (error) {
    console.error('Dashboard request failed', error);
    return NextResponse.json({ error: 'Unable to load dashboard data.' }, { status: 500 });
  }
}
