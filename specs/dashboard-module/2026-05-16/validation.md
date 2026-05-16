# Validation Criteria — Dashboard & Analytics Module

## Functional Validation
- [ ] **Summary Cards:**
    - [ ] Total Sales card shows correct revenue for the selected date range.
    - [ ] Noodles and Momos sub-breakdown matches individual product totals.
    - [ ] Total Expenses card matches the sum of all expenses in the selected range.
    - [ ] Net Profit/Loss = Total Sales − Total Expenses (displays green for profit, red for loss).
    - [ ] Client Dues card shows correct cumulative outstanding amount across all clients.
    - [ ] Inventory Status card shows correct current stock levels for all tracked items.
- [ ] **Date Range Filter:**
    - [ ] Changing the date range updates all cards and charts (except Dues and Inventory which are cumulative).
    - [ ] "Today" preset correctly filters to today's date only.
    - [ ] "This Week" preset filters from Monday to today.
    - [ ] "This Month" preset filters from 1st of current month to today.
    - [ ] "Last 30 Days" preset filters from 30 days ago to today.
    - [ ] Custom date selection works correctly with any valid date range.
- [ ] **Charts:**
    - [ ] Sales Trend line chart plots correct daily revenue values.
    - [ ] Expense Breakdown doughnut chart segments match category totals.
    - [ ] Profit/Loss bar chart shows accurate Revenue vs Expenses per period.
    - [ ] Client Dues chart shows the correct top clients sorted by dues amount.
    - [ ] All charts display "No data" state when there are no records for the period.
- [ ] **Recent Activity:**
    - [ ] Shows the last 10 combined sales + expense entries.
    - [ ] Entries are sorted newest first.
    - [ ] Each entry correctly displays type (sale/expense), description, amount (PKR), and date.
- [ ] **Empty States:**
    - [ ] Cards show ₨ 0 when no data exists.
    - [ ] Charts show a placeholder message when no data exists.

## Security Validation
- [ ] **RLS:** Only authenticated users can access dashboard data.
- [ ] **API Protection:** Unauthenticated requests to `/api/dashboard/*` are rejected with 401.

## UX & Mobile Validation
- [ ] Summary cards stack vertically on mobile and are fully readable.
- [ ] Charts stack vertically on mobile and resize correctly.
- [ ] Date range filter is usable on small screens (inputs and presets stack/wrap).
- [ ] Recent activity feed is readable on narrow screens.
- [ ] Loading skeleton states are shown during data fetching.
- [ ] Per-section error messages display correctly if an API call fails.
- [ ] All monetary values are formatted in PKR with proper separators.
