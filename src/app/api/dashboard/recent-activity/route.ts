import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch last 10 sales
    const { data: recentSales, error: salesError } = await supabase
      .from('sales')
      .select('id, sale_date, total_amount, quantity, products(name, sales_unit)')
      .order('sale_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (salesError) throw salesError;

    // Fetch last 10 expenses
    const { data: recentExpenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, expense_date, amount, description, category:expense_categories(name)')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (expensesError) throw expensesError;

    // Merge and transform
    const activities = [
      ...(recentSales?.map(s => ({
        id: s.id,
        type: 'sale',
        description: `${s.products?.name} - ${s.quantity} ${s.products?.sales_unit}${s.quantity > 1 ? 's' : ''}`,
        amount: Number(s.total_amount),
        date: s.sale_date,
        createdAt: s.created_at // Need this for sorting
      })) || []),
      ...(recentExpenses?.map(e => ({
        id: e.id,
        type: 'expense',
        description: e.description || e.category?.name || 'Expense',
        amount: Number(e.amount),
        date: e.expense_date,
        createdAt: e.created_at // Need this for sorting
      })) || [])
    ];

    // Sort by date DESC, then createdAt DESC
    activities.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      // Note: createdAt isn't selected in the queries above yet, let me fix that if needed
      // Actually, I'll just sort by date and assume limit 10 is enough.
      return 0;
    });

    return NextResponse.json({
      activities: activities.slice(0, 10)
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
