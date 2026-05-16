import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get top 10 clients for the chart
    const { data: topClients, error: topError } = await supabase
      .from('client_summary')
      .select('id, name, current_dues')
      .eq('is_archived', false)
      .gt('current_dues', 0)
      .order('current_dues', { ascending: false })
      .limit(10);

    if (topError) throw topError;

    // Get total dues for the summary card
    const { data: totalData, error: totalError } = await supabase
      .from('client_summary')
      .select('current_dues')
      .eq('is_archived', false)
      .gt('current_dues', 0);

    if (totalError) throw totalError;

    const totalDues = totalData?.reduce((sum, client) => sum + Number(client.current_dues), 0) || 0;

    const clients = topClients?.map(client => ({
      id: client.id,
      name: client.name,
      currentDues: Number(client.current_dues)
    })) || [];

    return NextResponse.json({
      totalDues,
      clients
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
