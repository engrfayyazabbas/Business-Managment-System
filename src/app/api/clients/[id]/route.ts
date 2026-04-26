import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // 1. Fetch client details from the summary view
  const { data: client, error: clientError } = await supabase
    .from('client_summary')
    .select('*')
    .eq('id', id)
    .single();

  if (clientError) {
    return NextResponse.json({ error: clientError.message }, { status: 500 });
  }
  
  if (!client) {
     return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  // 2. Fetch order history
  const { data: sales, error: salesError } = await supabase
    .from('sales')
    .select('*, products(name, sales_unit)')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (salesError) {
    return NextResponse.json({ error: salesError.message }, { status: 500 });
  }

  // 3. Fetch payment history
  const { data: payments, error: paymentsError } = await supabase
    .from('client_payments')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (paymentsError) {
    return NextResponse.json({ error: paymentsError.message }, { status: 500 });
  }

  return NextResponse.json({
    client,
    sales: sales || [],
    payments: payments || [],
  });
}
