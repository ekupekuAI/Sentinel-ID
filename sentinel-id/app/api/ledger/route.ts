import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLedgerEntries } from '@/repositories/analysisRepository';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ data: await getLedgerEntries(supabase, user.id) });
  } catch (error) {
    console.error('Ledger request failed', error);
    return NextResponse.json({ error: 'Unable to load ledger entries.' }, { status: 500 });
  }
}
