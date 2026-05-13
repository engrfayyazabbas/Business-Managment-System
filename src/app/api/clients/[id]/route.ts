import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { id } = params;
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch client summary
    const { data: client, error: clientError } = await supabase
      .from('client_summary')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError) {
      return NextResponse.json({ error: clientError.message }, { status: 404 });
    }

    // 2. Fetch sales history
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*, products(name, sales_unit)')
      .eq('client_id', id)
      .order('sale_date', { ascending: false });

    if (salesError) {
      return NextResponse.json({ error: salesError.message }, { status: 500 });
    }

    // 3. Fetch payment history
    const { data: payments, error: paymentsError } = await supabase
      .from('client_payments')
      .select('*')
      .eq('client_id', id)
      .order('payment_date', { ascending: false });

    if (paymentsError) {
      return NextResponse.json({ error: paymentsError.message }, { status: 500 });
    }

    return NextResponse.json({
      client,
      sales: sales || [],
      payments: payments || []
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { is_archived } = await request.json();

    const { data, error } = await supabase
      .from('clients')
      .update({ is_archived })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
