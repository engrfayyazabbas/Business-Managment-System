import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SalesSummaryItem {
  quantity: number;
  total_amount: number;
  products: {
    name: string;
    sales_unit: string;
  } | null;
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing date range parameters' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('sales')
      .select('quantity, total_amount, products(name, sales_unit)')
      .gte('sale_date', from)
      .lte('sale_date', to);

    if (error) throw error;

    let totalRevenue = 0;
    let totalQuantity = 0;
    const breakdownMap: Record<string, { product: string; quantity: number; revenue: number; unit: string }> = {};

    (data as unknown as SalesSummaryItem[] | null)?.forEach((sale) => {
      const productName = sale.products?.name || 'Unknown';
      const unit = sale.products?.sales_unit || '';
      const revenue = Number(sale.total_amount) || 0;
      const quantity = Number(sale.quantity) || 0;

      totalRevenue += revenue;
      totalQuantity += quantity;

      if (!breakdownMap[productName]) {
        breakdownMap[productName] = { product: productName, quantity: 0, revenue: 0, unit };
      }
      breakdownMap[productName].quantity += quantity;
      breakdownMap[productName].revenue += revenue;
    });

    return NextResponse.json({
      totalRevenue,
      totalQuantity,
      breakdown: Object.values(breakdownMap)
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
