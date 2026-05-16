# Implementation Plan — Dashboard & Analytics Module (Detailed)

## Phase 0: Deployment Prerequisites
- [ ] **Verify Vercel Environment Variables** are configured:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - Set in: **Vercel → Project → Settings → Environment Variables**
- [ ] ⚠️ `.env.local` is for local dev only — Vercel requires these to be set separately in its dashboard, otherwise the build will fail.

## Phase 1: API Endpoints
- [ ] **Sales Summary API:**
    - `src/app/api/dashboard/sales-summary/route.ts` (GET)
    - Query `sales` joined with `products`, aggregate by product, filter by date range.
- [ ] **Expense Summary API:**
    - `src/app/api/dashboard/expense-summary/route.ts` (GET)
    - Query `expenses` joined with `expense_categories`, aggregate by category, filter by date range.
- [ ] **Profit/Loss API:**
    - `src/app/api/dashboard/profit-loss/route.ts` (GET)
    - Query `sales` and `expenses` aggregated by day/week, filter by date range.
- [ ] **Sales Trend API:**
    - `src/app/api/dashboard/sales-trend/route.ts` (GET)
    - Query `sales` grouped by `sale_date`, filter by date range.
- [ ] **Client Dues API:**
    - `src/app/api/dashboard/client-dues/route.ts` (GET)
    - Query `client_summary` view, return top clients sorted by `current_dues` DESC.
- [ ] **Recent Activity API:**
    - `src/app/api/dashboard/recent-activity/route.ts` (GET)
    - Union query: latest 10 from `sales` + `expenses`, sorted by date DESC.
- [ ] **Inventory Status API:**
    - `src/app/api/dashboard/inventory-status/route.ts` (GET)
    - Query `inventory_stock` view for current levels.

## Phase 2: Components
- [ ] `src/components/dashboard/DateRangeFilter.tsx`
- [ ] `src/components/dashboard/SummaryCards.tsx`
- [ ] `src/components/dashboard/SalesTrendChart.tsx`
- [ ] `src/components/dashboard/ExpenseBreakdownChart.tsx`
- [ ] `src/components/dashboard/ProfitLossChart.tsx`
- [ ] `src/components/dashboard/ClientDuesChart.tsx`
- [ ] `src/components/dashboard/RecentActivityFeed.tsx`

## Phase 3: Page Integration & Validation
- [ ] `src/app/(dashboard)/page.tsx`
- [ ] Wire up date range state to all API calls.
- [ ] Implement skeleton loaders and per-section error handling.
- [ ] Manual testing and validation against `validation.md`.
- [ ] Mobile responsiveness check on 375px, 768px, and 1024px+ breakpoints.
