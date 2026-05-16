# Implementation Plan — Dashboard & Analytics Module

## 1. API Implementation (Dedicated Endpoints)
- [ ] **Sales Summary API:**
    - [ ] `GET /api/dashboard/sales-summary` — Returns total sales revenue, quantity breakdown by product (Noodles packs, Momos pieces), filtered by date range (`?from=YYYY-MM-DD&to=YYYY-MM-DD`).
- [ ] **Expense Summary API:**
    - [ ] `GET /api/dashboard/expense-summary` — Returns total expenses and breakdown by category for the given date range.
- [ ] **Profit/Loss API:**
    - [ ] `GET /api/dashboard/profit-loss` — Returns daily/weekly aggregated revenue and expenses for the selected date range (for the bar chart).
- [ ] **Sales Trend API:**
    - [ ] `GET /api/dashboard/sales-trend` — Returns daily sales totals for the line chart, filtered by date range.
- [ ] **Client Dues API:**
    - [ ] `GET /api/dashboard/client-dues` — Returns top clients with outstanding dues (from `client_summary` view). Not date-filtered.
- [ ] **Recent Activity API:**
    - [ ] `GET /api/dashboard/recent-activity` — Returns last 10 combined sales + expense entries, sorted by date descending.
- [ ] **Inventory Status API:**
    - [ ] `GET /api/dashboard/inventory-status` — Returns current stock levels from `inventory_stock` view. Not date-filtered.

## 2. Component Development
- [ ] **DateRangeFilter:**
    - [ ] Start date and end date inputs.
    - [ ] Quick preset buttons: "Today", "This Week", "This Month", "Last 30 Days".
    - [ ] Default to current month range.
    - [ ] Triggers data re-fetch on change.
- [ ] **SummaryCards:**
    - [ ] Grid of 5 cards: Total Sales (with Noodles/Momos sub-text), Total Expenses, Net Profit/Loss, Client Dues, Inventory Status.
    - [ ] Color-coded: green for profit, red for loss.
    - [ ] PKR formatting for all monetary values.
    - [ ] Inventory card shows a mini list of items and their stock levels.
- [ ] **SalesTrendChart:**
    - [ ] Line chart using Chart.js / react-chartjs-2.
    - [ ] X-axis: dates, Y-axis: revenue (PKR).
    - [ ] Responsive sizing.
- [ ] **ExpenseBreakdownChart:**
    - [ ] Doughnut chart using Chart.js / react-chartjs-2.
    - [ ] Segments colored by category.
    - [ ] Legend showing category names and amounts.
- [ ] **ProfitLossChart:**
    - [ ] Grouped bar chart: Revenue (gold) vs Expenses (red) per time period.
    - [ ] Uses Chart.js / react-chartjs-2.
- [ ] **ClientDuesChart:**
    - [ ] Horizontal bar chart showing top clients by outstanding dues.
    - [ ] Uses Chart.js / react-chartjs-2.
- [ ] **RecentActivityFeed:**
    - [ ] Card-based list of last 10 entries.
    - [ ] Each entry: icon (🛒 sale / 💸 expense), description, amount (PKR), date.
    - [ ] Sorted newest first.

## 3. Page Integration
- [ ] Update `src/app/(dashboard)/page.tsx`:
    - [ ] **UI Consistency:** Follow the pattern established in the Clients and Inventory modules:
        - Page header with title and subtitle.
        - Date range filter bar at the top.
        - Summary cards grid below the filter.
        - Charts in a 2×2 grid on desktop.
        - Recent Activity feed at the bottom.
    - [ ] Implement state management for the selected date range.
    - [ ] Fetch all dashboard data on page load and on date range change.
    - [ ] Show skeleton loaders during fetch.
    - [ ] Handle errors per-section (not full-page).

## 4. Deployment & Environment Variables
- [ ] **Pre-Deployment Check:** Before deploying to Vercel, ensure the following environment variables are set in **Vercel → Project → Settings → Environment Variables** (not just `.env.local`):
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **Known Issue:** The build will **fail on Vercel** if these variables are missing, because the Supabase client initializes at build time during SSR/SSG and expects them to exist.
- [ ] **Reference:** See `specs/stack-tech.md` → Environment Variables section for details on where to find these values.

> ⚠️ `.env.local` is for local development only — it is NOT deployed to Vercel. You must add the variables manually in the Vercel dashboard.

## 5. Mobile Optimization
- [ ] Summary cards: single column stack on mobile.
- [ ] Charts: full-width, stacked vertically on mobile.
- [ ] Date range filter: stack inputs vertically, preset buttons wrap.
- [ ] Recent activity: compact card layout for narrow screens.
- [ ] Test readability of chart labels and values on small screens.
