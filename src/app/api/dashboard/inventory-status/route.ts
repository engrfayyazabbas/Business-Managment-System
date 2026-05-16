import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('inventory_stock')
      .select('id, name, unit, current_stock')
      .eq('is_archived', false)
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      items: data.map(item => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        currentStock: Number(item.current_stock)
      }))
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
