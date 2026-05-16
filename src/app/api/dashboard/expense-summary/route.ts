import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface ExpenseSummaryItem {
  amount: number;
  category: {
    name: string;
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
      .from('expenses')
      .select('amount, category:expense_categories(name)')
      .gte('expense_date', from)
      .lte('expense_date', to);

    if (error) throw error;

    let totalExpenses = 0;
    const breakdownMap: Record<string, { category: string; amount: number }> = {};

    (data as unknown as ExpenseSummaryItem[] | null)?.forEach((expense) => {
      const categoryName = expense.category?.name || 'Uncategorized';
      const amount = Number(expense.amount) || 0;

      totalExpenses += amount;

      if (!breakdownMap[categoryName]) {
        breakdownMap[categoryName] = { category: categoryName, amount: 0 };
      }
      breakdownMap[categoryName].amount += amount;
    });

    return NextResponse.json({
      totalExpenses,
      breakdown: Object.values(breakdownMap).sort((a, b) => b.amount - a.amount)
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
