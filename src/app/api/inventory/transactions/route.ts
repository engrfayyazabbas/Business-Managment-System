import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const filterType = searchParams.get('type'); // 'production' or 'raw_material'
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabase
    .from('inventory_transactions')
    .select(`
      id,
      created_at,
      transaction_date,
      type,
      quantity,
      notes,
      inventory_items (
        id,
        name,
        unit
      )
    `)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filterType === 'production') {
    query = query.eq('type', 'production');
  } else if (filterType === 'raw_material') {
    query = query.in('type', ['purchase', 'consumption']);
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

  const { inventory_item_id, type, quantity } = await request.json();

  if (type === 'consumption') {
    const { data: stock, error: stockError } = await supabase
      .from('inventory_stock')
      .select('current_stock')
      .eq('id', inventory_item_id)
      .single();

    if (stockError || !stock) {
      return NextResponse.json({ error: 'Failed to retrieve stock' }, { status: 500 });
    }

    if (stock.current_stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from('inventory_transactions')
    .insert([{ 
      item_id: inventory_item_id, 
      type, 
      quantity,
      created_by: user.id
    }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
