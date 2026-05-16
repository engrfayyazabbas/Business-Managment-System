import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface ProfitLossItem {
  date: string;
  revenue: number;
  expenses: number;
}

interface DBProfitLossItem {
  sale_date?: string;
  expense_date?: string;
  total_amount?: number;
  amount?: number;
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
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('sale_date, total_amount')
      .gte('sale_date', from)
      .lte('sale_date', to);

    if (salesError) throw salesError;

    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('expense_date, amount')
      .gte('expense_date', from)
      .lte('expense_date', to);

    if (expenseError) throw expenseError;

    const profitLossMap: Record<string, ProfitLossItem> = {};

    (salesData as unknown as DBProfitLossItem[])?.forEach((sale) => {
      const date = sale.sale_date!;
      const amount = Number(sale.total_amount) || 0;
      if (!profitLossMap[date]) {
        profitLossMap[date] = { date, revenue: 0, expenses: 0 };
      }
      profitLossMap[date].revenue += amount;
    });

    (expenseData as unknown as DBProfitLossItem[])?.forEach((expense) => {
      const date = expense.expense_date!;
      const amount = Number(expense.amount) || 0;
      if (!profitLossMap[date]) {
        profitLossMap[date] = { date, revenue: 0, expenses: 0 };
      }
      profitLossMap[date].expenses += amount;
    });

    const resultData = Object.values(profitLossMap).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({ data: resultData });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
