# Implementation Plan — Dashboard & Analytics Module

> **Single source of truth for implementation.** This document covers API endpoints, components, page integration, codebase patterns, and deployment — everything an AI agent needs to build this module.

---

## Codebase Patterns (MUST FOLLOW)

> These patterns are extracted from the existing codebase. All new code MUST follow them for consistency.

### API Route Pattern
- **Location:** `src/app/api/dashboard/[endpoint-name]/route.ts`
- **Supabase client:** `import { createClient } from '@/utils/supabase/server';`
- **Response helper:** `import { NextResponse } from 'next/server';`
- **Auth check (required for ALL dashboard routes):**
  ```typescript
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  ```
- **Error response format:** `NextResponse.json({ error: error.message }, { status: 500 })`
- **Date range params:** Use query parameters `?from=YYYY-MM-DD&to=YYYY-MM-DD`:
  ```typescript
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  ```
- **Date filtering with Supabase:** `.gte('sale_date', from)` and `.lte('sale_date', to)`

### Component Pattern
- **Location:** `src/components/dashboard/[ComponentName].tsx`
- **Must start with:** `'use client';`
- **State management:** `useState` + `useEffect` from `react`
- **Data fetching:** Use browser `fetch('/api/dashboard/...')` — NOT direct Supabase client calls
- **TypeScript interfaces:** Define above each component for all data shapes
- **Error handling pattern (from ClientList.tsx):**
  ```typescript
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/...');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      // set state
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };
  ```

### Styling Pattern
- **Use `<style jsx>` blocks** inside each component (see `ClientList.tsx`, `inventory/page.tsx` for reference)
- **Use CSS variables from `globals.css`:** `var(--primary)`, `var(--card-bg)`, `var(--border)`, `var(--success)`, `var(--danger)`, `var(--background)`, `var(--foreground)`, `var(--space-md)`, `var(--border-radius)`, etc.
- **Do NOT use Tailwind utility classes** (the project does not use Tailwind)
- **Do NOT use CSS Modules** (the project does not use them)
- **Card styling:** Use the global `.card` class from `globals.css` as a base
- **Mobile breakpoint:** `@media (max-width: 768px)` — matches existing layout breakpoint in `layout.css`

### Currency Formatting
- **Pattern (from ClientList.tsx):** `PKR {Number(value).toLocaleString()}`
- Example: `PKR 45,000`
- Wrap in a reusable helper if needed: `src/utils/format.ts`

### Page Pattern (from clients/page.tsx)
- Server component shell with metadata:
  ```typescript
  export const metadata = {
    title: 'Dashboard - GoldenPhoenix',
  };
  ```
- Dashboard page is special: it's a `'use client'` component at `src/app/(dashboard)/page.tsx` since it manages date range state.

---

## Phase 1: Install Chart.js Dependencies

The project currently does **NOT** have `chart.js` or `react-chartjs-2` installed (see `package.json`).

- [ ] Run: `npm install chart.js react-chartjs-2`
- [ ] **Chart.js SSR note:** Chart.js only works in the browser. All chart components must be `'use client'` components. If Next.js still errors about SSR, use dynamic import:
  ```typescript
  import dynamic from 'next/dynamic';
  const SalesTrendChart = dynamic(() => import('@/components/dashboard/SalesTrendChart'), { ssr: false });
  ```
- [ ] **Chart.js registration:** Every chart component must register the chart elements it uses:
  ```typescript
  import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  ```

---

## Phase 2: API Endpoints

### 2.1 Sales Summary
- **File:** `src/app/api/dashboard/sales-summary/route.ts`
- **Method:** `GET`
- **Query params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Logic:** Query `sales` joined with `products`, aggregate total revenue (`SUM(total_amount)`), total quantity, and breakdown by product name. Filter by `sale_date` between `from` and `to`.
- **Supabase query approach:** Fetch all sales in range with product info, then aggregate in JS (Supabase JS client doesn't support `GROUP BY` natively):
  ```typescript
  const { data, error } = await supabase
    .from('sales')
    .select('quantity, total_amount, products(name, sales_unit)')
    .gte('sale_date', from)
    .lte('sale_date', to);
  ```
  Then aggregate in code to produce the response.
- **Response shape:**
  ```json
  {
    "totalRevenue": 45000,
    "totalQuantity": 150,
    "breakdown": [
      { "product": "Noodles", "quantity": 100, "revenue": 30000, "unit": "pack" },
      { "product": "Momos", "quantity": 50, "revenue": 15000, "unit": "piece" }
    ]
  }
  ```

### 2.2 Expense Summary
- **File:** `src/app/api/dashboard/expense-summary/route.ts`
- **Method:** `GET`
- **Query params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Logic:** Query `expenses` joined with `expense_categories`, aggregate total and breakdown by category name. Filter by `expense_date` between `from` and `to`.
- **Supabase query:**
  ```typescript
  const { data, error } = await supabase
    .from('expenses')
    .select('amount, category:expense_categories(name)')
    .gte('expense_date', from)
    .lte('expense_date', to);
  ```
- **Response shape:**
  ```json
  {
    "totalExpenses": 20000,
    "breakdown": [
      { "category": "Flour", "amount": 10000 },
      { "category": "Packaging", "amount": 5000 },
      { "category": "Transport", "amount": 5000 }
    ]
  }
  ```

### 2.3 Profit/Loss (Bar Chart Data)
- **File:** `src/app/api/dashboard/profit-loss/route.ts`
- **Method:** `GET`
- **Query params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Logic:** Fetch all sales and expenses in range, group by date (day-level), return revenue vs expenses per day.
- **Implementation:** Fetch sales grouped by `sale_date` and expenses grouped by `expense_date`, then merge by date in JS.
- **Response shape:**
  ```json
  {
    "data": [
      { "date": "2026-05-01", "revenue": 5000, "expenses": 3000 },
      { "date": "2026-05-02", "revenue": 7000, "expenses": 2000 }
    ]
  }
  ```

### 2.4 Sales Trend (Line Chart Data)
- **File:** `src/app/api/dashboard/sales-trend/route.ts`
- **Method:** `GET`
- **Query params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Logic:** Fetch sales in range, group by `sale_date`, sum `total_amount` per day.
- **Supabase query:**
  ```typescript
  const { data, error } = await supabase
    .from('sales')
    .select('sale_date, total_amount')
    .gte('sale_date', from)
    .lte('sale_date', to)
    .order('sale_date', { ascending: true });
  ```
  Then group by `sale_date` in JS.
- **Response shape:**
  ```json
  {
    "data": [
      { "date": "2026-05-01", "revenue": 5000 },
      { "date": "2026-05-02", "revenue": 7000 }
    ]
  }
  ```

### 2.5 Client Dues (NOT date-filtered)
- **File:** `src/app/api/dashboard/client-dues/route.ts`
- **Method:** `GET`
- **No date params** — dues are cumulative.
- **Logic:** Query `client_summary` view, filter `is_archived = false`, return top 10 clients sorted by `current_dues` DESC, only where `current_dues > 0`.
- **Supabase query:**
  ```typescript
  const { data, error } = await supabase
    .from('client_summary')
    .select('id, name, current_dues')
    .eq('is_archived', false)
    .gt('current_dues', 0)
    .order('current_dues', { ascending: false })
    .limit(10);
  ```
- **Response shape:**
  ```json
  {
    "totalDues": 25000,
    "clients": [
      { "id": "uuid", "name": "Ali Khan", "currentDues": 15000 },
      { "id": "uuid", "name": "Ahmed", "currentDues": 10000 }
    ]
  }
  ```

### 2.6 Recent Activity
- **File:** `src/app/api/dashboard/recent-activity/route.ts`
- **Method:** `GET`
- **No date params** — always returns the latest 10.
- **Logic:** Fetch last 10 sales (with product name) and last 10 expenses (with category name), merge into a single array, sort by date DESC, take first 10.
- **Supabase queries:**
  ```typescript
  const { data: recentSales } = await supabase
    .from('sales')
    .select('id, sale_date, total_amount, products(name)')
    .order('sale_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: recentExpenses } = await supabase
    .from('expenses')
    .select('id, expense_date, amount, description, category:expense_categories(name)')
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10);
  ```
  Then merge, sort, and take top 10.
- **Response shape:**
  ```json
  {
    "activities": [
      { "type": "sale", "description": "Noodles - 20 packs", "amount": 6000, "date": "2026-05-16" },
      { "type": "expense", "description": "Flour purchase", "amount": 3000, "date": "2026-05-15" }
    ]
  }
  ```

### 2.7 Inventory Status (NOT date-filtered)
- **File:** `src/app/api/dashboard/inventory-status/route.ts`
- **Method:** `GET`
- **No date params** — stock is cumulative.
- **Logic:** Query `inventory_stock` view where `is_archived = false`.
- **Supabase query:**
  ```typescript
  const { data, error } = await supabase
    .from('inventory_stock')
    .select('id, name, unit, current_stock')
    .eq('is_archived', false)
    .order('name', { ascending: true });
  ```
- **Response shape:**
  ```json
  {
    "items": [
      { "id": "uuid", "name": "Flour", "unit": "kg", "currentStock": 50 },
      { "id": "uuid", "name": "Noodles Pack", "unit": "pack", "currentStock": 200 }
    ]
  }
  ```

---

## Phase 3: Components

### 3.1 `src/components/dashboard/DateRangeFilter.tsx`
- **Props:** `{ from: string; to: string; onChange: (from: string, to: string) => void }`
- Start date and end date `<input type="date">` fields.
- Quick preset buttons: "Today", "This Week", "This Month", "Last 30 Days".
- Default to current month range (1st of month to today).
- On change (input or preset click), call `onChange(from, to)`.
- **Preset logic:**
    - "Today": both `from` and `to` = today's date
    - "This Week": `from` = Monday of current week, `to` = today
    - "This Month": `from` = 1st of current month, `to` = today
    - "Last 30 Days": `from` = 30 days ago, `to` = today

### 3.2 `src/components/dashboard/SummaryCards.tsx`
- **Props:** `{ salesSummary, expenseSummary, clientDues, inventoryStatus, loading, errors }`
- Grid of 5 cards:
    1. **Total Sales:** Shows `totalRevenue` with Noodles/Momos sub-text (from `breakdown`).
    2. **Total Expenses:** Shows `totalExpenses`.
    3. **Net Profit/Loss:** Shows `totalRevenue - totalExpenses`. Green text (`var(--success)`) for profit, red text (`var(--danger)`) for loss.
    4. **Client Dues:** Shows `totalDues`.
    5. **Inventory Status:** Shows mini list of items and stock levels.
- PKR formatting for all monetary values.
- Show `Loading...` while data is being fetched.
- Show error message per card if its API failed.

### 3.3 `src/components/dashboard/SalesTrendChart.tsx`
- **Props:** `{ data: { date: string; revenue: number }[] }`
- Line chart using `react-chartjs-2` `<Line>` component.
- X-axis: dates, Y-axis: revenue (PKR).
- Line color: `#FFD700` (gold/primary).
- Responsive sizing.
- **Register:** `CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend`

### 3.4 `src/components/dashboard/ExpenseBreakdownChart.tsx`
- **Props:** `{ data: { category: string; amount: number }[] }`
- Doughnut chart using `react-chartjs-2` `<Doughnut>` component.
- Segments colored by category (use a predefined palette).
- Legend showing category names and amounts.
- **Register:** `ArcElement, Tooltip, Legend`

### 3.5 `src/components/dashboard/ProfitLossChart.tsx`
- **Props:** `{ data: { date: string; revenue: number; expenses: number }[] }`
- Grouped bar chart using `react-chartjs-2` `<Bar>` component.
- Revenue bars: `#FFD700` (gold), Expense bars: `#dc3545` (red/danger).
- **Register:** `CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend`

### 3.6 `src/components/dashboard/ClientDuesChart.tsx`
- **Props:** `{ data: { name: string; currentDues: number }[] }`
- Horizontal bar chart using `react-chartjs-2` `<Bar>` with `indexAxis: 'y'`.
- Bar color: `#FF4500` (secondary/phoenix).
- **Register:** `CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend`

### 3.7 `src/components/dashboard/RecentActivityFeed.tsx`
- **Props:** `{ activities: { type: string; description: string; amount: number; date: string }[]; loading: boolean; error: string }`
- Card-based list of entries.
- Each entry: icon (`🛒` for sale, `💸` for expense), description, amount (PKR), date.
- Sorted newest first (already sorted by API).

### Chart Color Palette Reference
```
Gold (Primary/Revenue):  #FFD700
Phoenix (Secondary):     #FF4500
Danger (Expenses/Loss):  #dc3545
Success (Profit):        #28a745
Warning:                 #ffc107
Category colors:         ['#FFD700', '#FF4500', '#28a745', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c']
```

---

## Phase 4: Page Integration

- [ ] **File:** `src/app/(dashboard)/page.tsx`
- [ ] Convert to `'use client'` component (needs state management for date range).
- [ ] **State:**
    - `from` and `to` date strings (default: 1st of current month, today)
    - Separate state + loading + error for each data section
- [ ] **Layout order:**
    1. Page header: `<h1>Dashboard</h1>` with subtitle
    2. `<DateRangeFilter>` at the top
    3. `<SummaryCards>` grid below
    4. Charts in a 2×2 CSS Grid on desktop (stacked on mobile)
    5. `<RecentActivityFeed>` at the bottom
- [ ] **Data fetching:** On mount + whenever `from`/`to` changes, fetch ALL date-dependent APIs in parallel:
    ```typescript
    Promise.all([
      fetch(`/api/dashboard/sales-summary?from=${from}&to=${to}`),
      fetch(`/api/dashboard/expense-summary?from=${from}&to=${to}`),
      fetch(`/api/dashboard/profit-loss?from=${from}&to=${to}`),
      fetch(`/api/dashboard/sales-trend?from=${from}&to=${to}`),
    ]);
    ```
- [ ] Fetch date-independent APIs only once on mount:
    ```typescript
    fetch('/api/dashboard/client-dues');
    fetch('/api/dashboard/recent-activity');
    fetch('/api/dashboard/inventory-status');
    ```
- [ ] Show `Loading...` per section during fetch.
- [ ] Handle errors per section — if sales API fails, still show expenses, charts, etc.

---

## Phase 5: Mobile Optimization

- [ ] Summary cards: `grid-template-columns: 1fr` below 768px.
- [ ] Charts: full-width, stacked vertically below 768px.
- [ ] Date range filter: stack date inputs vertically, preset buttons wrap with `flex-wrap: wrap`.
- [ ] Recent activity: compact card layout for narrow screens.
- [ ] All text/values remain readable without horizontal scrolling.
- [ ] **Test at:** 375px (phone), 768px (tablet), 1024px+ (desktop).

---

## Phase 6: Deployment Prerequisites

- [ ] **Verify Vercel Environment Variables** are configured:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Set in: **Vercel → Project → Settings → Environment Variables**
- [ ] ⚠️ `.env.local` is for local dev only — Vercel requires these to be set separately in its dashboard, otherwise the build will fail.
- [ ] **Reference:** See `specs/stack-tech.md` → Environment Variables section.
