import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SalesTrendItem {
  sale_date: string;
  total_amount: number;
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
      .select('sale_date, total_amount')
      .gte('sale_date', from)
      .lte('sale_date', to)
      .order('sale_date', { ascending: true });

    if (error) throw error;

    const trendMap: Record<string, { date: string; revenue: number }> = {};

    (data as unknown as SalesTrendItem[])?.forEach((sale) => {
      const date = sale.sale_date;
      const amount = Number(sale.total_amount) || 0;
      if (!trendMap[date]) {
        trendMap[date] = { date, revenue: 0 };
      }
      trendMap[date].revenue += amount;
    });

    const resultData = Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ data: resultData });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
