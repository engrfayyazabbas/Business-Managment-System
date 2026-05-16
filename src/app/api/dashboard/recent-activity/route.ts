import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface SaleActivity {
  id: string;
  sale_date: string;
  total_amount: number;
  quantity: number;
  created_at: string;
  products: {
    name: string;
    sales_unit: string;
  } | null;
}

interface ExpenseActivity {
  id: string;
  expense_date: string;
  amount: number;
  description: string;
  created_at: string;
  category: {
    name: string;
  } | null;
}

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
      .select('id, sale_date, total_amount, quantity, created_at, products(name, sales_unit)')
      .order('sale_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (salesError) throw salesError;

    // Fetch last 10 expenses
    const { data: recentExpenses, error: expensesError } = await supabase
      .from('expenses')
      .select('id, expense_date, amount, description, created_at, category:expense_categories(name)')
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (expensesError) throw expensesError;

    // Merge and transform
    const activities = [
      ...((recentSales as unknown as SaleActivity[] | null)?.map(s => ({
        id: s.id,
        type: 'sale',
        description: `${s.products?.name || 'Unknown Product'} - ${s.quantity} ${s.products?.sales_unit || ''}${s.quantity > 1 ? 's' : ''}`,
        amount: Number(s.total_amount),
        date: s.sale_date,
        createdAt: s.created_at
      })) || []),
      ...((recentExpenses as unknown as ExpenseActivity[] | null)?.map(e => ({
        id: e.id,
        type: 'expense',
        description: e.description || e.category?.name || 'Expense',
        amount: Number(e.amount),
        date: e.expense_date,
        createdAt: e.created_at
      })) || [])
    ];

    // Sort by date DESC, then createdAt DESC
    activities.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });

    return NextResponse.json({
      activities: activities.slice(0, 10)
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
