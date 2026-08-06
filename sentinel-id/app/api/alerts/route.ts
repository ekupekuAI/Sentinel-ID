import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAlerts } from '@/repositories/securityRepository';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const alerts = await getAlerts(supabase, user.id);
    return NextResponse.json({ data: alerts.map((alert) => ({ id: alert.id, timestamp: new Date(alert.created_at).toLocaleString(), severity: alert.severity, type: alert.alert_type, description: alert.description, identity: user.email ?? 'Unknown', action: alert.action ?? 'Pending review', status: alert.status })) });
  } catch (error) {
    console.error('Alerts request failed', error);
    return NextResponse.json({ error: 'Unable to load alerts.' }, { status: 500 });
  }
}
