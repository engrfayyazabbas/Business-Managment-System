# Requirements — Dashboard & Analytics Module

## Scope
The Dashboard & Analytics Module serves as the home page of the GoldenPhoenix Noodles BMS. It provides a comprehensive, at-a-glance overview of the business's financial health — combining sales performance, expense tracking, client dues, and inventory status into a single, data-rich view.

## Key Features
- **Summary Cards (Full):**
    - Total Sales with Noodles vs Momos breakdown (quantity & revenue).
    - Total Expenses for the selected period.
    - Net Profit/Loss (Total Sales Revenue − Total Expenses).
    - Total Outstanding Client Dues.
    - Inventory Stock Status (current levels for all tracked items).
- **Charts & Visualizations:**
    - **Sales Trend (Line Chart):** Daily/weekly/monthly sales revenue over the selected date range.
    - **Expense Breakdown (Doughnut Chart):** Expenses split by category for the selected period.
    - **Profit/Loss Comparison (Bar Chart):** Revenue vs Expenses side-by-side, grouped by day/week/month.
    - **Client Dues Overview (Horizontal Bar Chart):** Top clients by outstanding dues.
- **Custom Date Range Filter:**
    - User selects a custom start and end date to filter all dashboard data.
    - Default range: current month (1st of month to today).
    - Quick presets: "Today", "This Week", "This Month", "Last 30 Days".
- **Recent Activity Feed:**
    - Combined feed of the last 10 recent sales and expenses, sorted by date (newest first).
    - Each entry shows: type icon (sale/expense), description, amount (PKR), and date.

## Business Rules
- **Currency:** All monetary values displayed in Pakistani Rupees (PKR).
- **Profit/Loss Calculation:** `Net Profit = Total Sales Revenue − Total Expenses` for the selected date range.
- **Client Dues:** Shows aggregate outstanding dues across all clients (not filtered by date range — dues are cumulative).
- **Inventory Status:** Shows real-time current stock levels (not filtered by date range — stock is cumulative).
- **Data Refresh:** Data is fetched fresh on every page load. No auto-refresh.
- **Empty States:** If no data exists for a period, charts show "No data" placeholder and cards show ₨ 0.

## User Experience
- **Main Dashboard Page:**
    - **Visual Consistency:** The layout must follow the established "Golden/Phoenix" theme, utilizing the same card styles, color variables, and typography as other modules.
    - Date range filter bar at the top.
    - Summary cards in a responsive grid below the filter.
    - Charts section with 2×2 grid on desktop, stacking vertically on mobile.
    - Recent Activity feed below the charts.
- **Mobile Optimization:**
    - Summary cards stack vertically in a single column.
    - Charts stack vertically below the cards (simple & clean layout).
    - Recent activity feed remains as a vertical list.
    - All text and values remain readable without horizontal scrolling.
- **Loading States:** Skeleton loaders shown while dashboard data is being fetched.
- **Error Handling:** Graceful fallback if any API call fails — show error message per section, not a full-page error.

## Data Sources (Existing Tables)
- `sales` + `products`: Revenue data, product breakdown (Noodles/Momos).
- `expenses` + `expense_categories`: Expense totals, category breakdown.
- `client_summary` (View): Outstanding client dues.
- `inventory_stock` (View): Current stock levels.
- `client_payments`: Payment history (for dues calculation).
