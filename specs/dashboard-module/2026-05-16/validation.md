# Validation Criteria — Dashboard & Analytics Module

> Each criterion below maps to a specific feature. Use this as a checklist after implementation.

## Functional Validation

### Summary Cards
- [ ] **Total Sales card** shows correct `SUM(sales.total_amount)` for the selected date range.
- [ ] Noodles and Momos sub-breakdown shows correct quantity and revenue per product.
- [ ] **Total Expenses card** shows correct `SUM(expenses.amount)` for the selected date range.
- [ ] **Net Profit/Loss** = Total Sales − Total Expenses.
    - [ ] Displays in green (`var(--success)` / `#28a745`) when profit (value ≥ 0).
    - [ ] Displays in red (`var(--danger)` / `#dc3545`) when loss (value < 0).
- [ ] **Client Dues card** shows correct cumulative `SUM(current_dues)` from `client_summary` view (where `is_archived = false` and `current_dues > 0`).
- [ ] **Inventory Status card** shows correct current stock levels for all items where `is_archived = false` from `inventory_stock` view.
- [ ] Client Dues and Inventory cards do **NOT** change when date range changes (they are cumulative).

### Date Range Filter
- [ ] Changing the date range triggers a re-fetch of sales summary, expense summary, profit/loss, and sales trend APIs.
- [ ] Client Dues, Inventory Status, and Recent Activity are **NOT** re-fetched on date change.
- [ ] **"Today"** preset: `from` = `to` = today's date (e.g., `2026-05-16`).
- [ ] **"This Week"** preset: `from` = Monday of current week, `to` = today.
- [ ] **"This Month"** preset: `from` = 1st of current month, `to` = today.
- [ ] **"Last 30 Days"** preset: `from` = 30 days ago, `to` = today.
- [ ] **Default range** on page load = "This Month" (1st of month to today).
- [ ] Custom date selection works correctly with any valid date range.

### Charts
- [ ] **Sales Trend (Line):** Plots correct daily `SUM(total_amount)` values from `sales` table. X-axis = dates, Y-axis = PKR.
- [ ] **Expense Breakdown (Doughnut):** Segments match `SUM(expenses.amount)` grouped by `expense_categories.name`.
- [ ] **Profit/Loss (Bar):** Shows grouped bars with Revenue (gold `#FFD700`) vs Expenses (red `#dc3545`) per day.
- [ ] **Client Dues (Horizontal Bar):** Shows correct top clients sorted by `current_dues` DESC.
- [ ] All charts display a "No data available" message/placeholder when there are no records for the period.
- [ ] Charts render correctly without SSR errors (Chart.js is browser-only).

### Recent Activity
- [ ] Shows exactly the last 10 combined sales + expense entries.
- [ ] Entries are sorted newest first (by `sale_date` / `expense_date`, then `created_at`).
- [ ] Sale entries show: 🛒 icon, product name + quantity (e.g., "Noodles - 20 packs"), amount in PKR, date.
- [ ] Expense entries show: 💸 icon, description or category name, amount in PKR, date.

### Empty States
- [ ] When no sales exist in the selected range, Total Sales card shows `PKR 0`.
- [ ] When no expenses exist, Total Expenses card shows `PKR 0`.
- [ ] Net Profit/Loss shows `PKR 0` (in green) when both sales and expenses are zero.
- [ ] Charts show "No data available" text — not a broken/empty chart canvas.
- [ ] When there are no clients with dues, Client Dues card shows `PKR 0` and chart shows "No data available".

---

## Security Validation
- [ ] **API Auth:** All 7 `/api/dashboard/*` routes call `supabase.auth.getUser()` and return `401` if not authenticated.
- [ ] **RLS:** Database-level RLS policies enforce `auth.role() = 'authenticated'` on all tables (already configured).
- [ ] **Unauthenticated test:** Calling any `/api/dashboard/*` endpoint without a valid session cookie returns `{ "error": "Unauthorized" }` with status `401`.

---

## Code Quality Validation
- [ ] All API route files are at `src/app/api/dashboard/[name]/route.ts`.
- [ ] All component files are at `src/components/dashboard/[Name].tsx`.
- [ ] All components use `'use client'` directive.
- [ ] All components use `<style jsx>` for styling (not Tailwind, not CSS modules).
- [ ] All CSS uses variables from `globals.css` (e.g., `var(--primary)`, `var(--card-bg)`).
- [ ] All TypeScript interfaces are defined for API response shapes.
- [ ] All monetary values use `PKR {Number(value).toLocaleString()}` format.
- [ ] `chart.js` and `react-chartjs-2` are added to `package.json` dependencies.
- [ ] Chart components register required Chart.js elements (`ChartJS.register(...)`).

---

## UX & Mobile Validation
- [ ] **Desktop (1024px+):** Summary cards in responsive grid (auto-fill), charts in 2×2 grid.
- [ ] **Tablet (768px):** Charts may start stacking, cards may reduce to 2 columns.
- [ ] **Mobile (375px):**
    - [ ] Summary cards stack in a single column.
    - [ ] Charts stack vertically, each full-width.
    - [ ] Date range filter inputs stack vertically.
    - [ ] Preset buttons wrap onto multiple rows.
    - [ ] Recent activity feed is readable without horizontal scrolling.
- [ ] **Loading states:** Each section shows `Loading...` text while its API call is in progress.
- [ ] **Per-section errors:** If one API fails, the other sections still render correctly with their data. The failed section shows an error message like `Failed to load sales data`.
- [ ] **Page doesn't crash** if any single API returns an error.
