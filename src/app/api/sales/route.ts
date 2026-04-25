import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const productId = searchParams.get('productId');

  const supabase = createClient();

  let query = supabase
    .from('sales')
    .select(`
      *,
      products (
        name,
        sales_unit
      )
    `)
    .order('sale_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (startDate) {
    query = query.gte('sale_date', startDate);
  }
  if (endDate) {
    query = query.lte('sale_date', endDate);
  }
  if (productId) {
    query = query.eq('product_id', productId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { product_id, quantity, unit_price, sale_date } = body;

  if (!product_id || !quantity || !unit_price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('sales')
    .insert([
      {
        product_id,
        quantity,
        unit_price,
        sale_date: sale_date || new Date().toISOString().split('T')[0],
        created_by: user.id,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}
