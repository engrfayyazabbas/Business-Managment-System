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
      ),
      clients (
        name
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
  const { product_id, quantity, unit_price, sale_date, client_id } = body;

  if (!product_id || !quantity || !unit_price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 1. Check if product is linked to inventory
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('inventory_item_id')
    .eq('id', product_id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // 2. If linked, validate stock
  if (product.inventory_item_id) {
    const { data: stockData, error: stockError } = await supabase
      .from('inventory_stock')
      .select('current_stock')
      .eq('id', product.inventory_item_id)
      .single();

    if (stockError) {
      return NextResponse.json({ error: 'Could not verify stock' }, { status: 500 });
    }

    if (!stockData || stockData.current_stock < quantity) {
      return NextResponse.json(
        { error: `Insufficient Stock. Available: ${stockData?.current_stock || 0}` },
        { status: 400 }
      );
    }
  }

  // 3. Record the sale
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .insert([
      {
        product_id,
        quantity,
        unit_price,
        client_id: client_id || null,
        sale_date: sale_date || new Date().toISOString().split('T')[0],
        created_by: user.id,
      },
    ])
    .select()
    .single();

  if (saleError) {
    return NextResponse.json({ error: saleError.message }, { status: 500 });
  }

  return NextResponse.json(saleData, { status: 201 });
}
