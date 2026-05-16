# Requirements — Dashboard & Analytics Module

## Scope
The Dashboard & Analytics Module serves as the home page of the GoldenPhoenix Noodles BMS. It provides a comprehensive, at-a-glance overview of the business's financial health — combining sales performance, expense tracking, client dues, and inventory status into a single, data-rich view.

## Key Features
- **Summary Cards (5 cards):**
    - Total Sales with Noodles vs Momos breakdown (quantity & revenue).
    - Total Expenses for the selected period.
    - Net Profit/Loss (Total Sales Revenue − Total Expenses).
    - Total Outstanding Client Dues.
    - Inventory Stock Status (current levels for all tracked items).
- **Charts & Visualizations:**
    - **Sales Trend (Line Chart):** Daily sales revenue over the selected date range.
    - **Expense Breakdown (Doughnut Chart):** Expenses split by category for the selected period.
    - **Profit/Loss Comparison (Bar Chart):** Revenue vs Expenses side-by-side, grouped by day.
    - **Client Dues Overview (Horizontal Bar Chart):** Top clients by outstanding dues.
- **Custom Date Range Filter:**
    - User selects a custom start and end date to filter all dashboard data.
    - Default range: current month (1st of month to today).
    - Quick presets: "Today", "This Week", "This Month", "Last 30 Days".
- **Recent Activity Feed:**
    - Combined feed of the last 10 recent sales and expenses, sorted by date (newest first).
    - Each entry shows: type icon (sale/expense), description, amount (PKR), and date.

## Business Rules
- **Currency:** All monetary values displayed in Pakistani Rupees (PKR) using `PKR {Number(value).toLocaleString()}` format (e.g., `PKR 1,234`). This matches the existing formatting pattern used in `ClientList.tsx`.
- **Revenue Calculation:** Sales revenue is the `total_amount` column (computed as `quantity * unit_price`, stored in database as a generated column).
- **Profit/Loss Calculation:** `Net Profit = SUM(sales.total_amount) − SUM(expenses.amount)` for the selected date range.
- **Client Dues:** Shows aggregate outstanding `current_dues` from `client_summary` view. **NOT filtered by date range** — dues are cumulative.
- **Inventory Status:** Shows current stock levels from `inventory_stock` view, filtered to `is_archived = false`. **NOT filtered by date range** — stock is cumulative.
- **Data Refresh:** Data is fetched fresh on every page load and when the date range changes. No auto-refresh / polling.
- **Empty States:** If no data exists for a period, charts show "No data available" placeholder and cards show `PKR 0`.

## Authentication & Security
- **RLS is already enabled** on all tables — Supabase enforces `auth.role() = 'authenticated'` for all operations.
- **API-level auth:** All dashboard API routes MUST additionally verify the user via `supabase.auth.getUser()` and return `401 Unauthorized` if not authenticated. This matches the pattern used in `GET /api/expenses` and `GET /api/inventory`.
- **Note:** `GET /api/sales` does NOT check auth at the API level (relies on RLS only). The dashboard APIs should follow the stricter pattern (checking auth at API level).

## User Experience
- **Main Dashboard Page:**
    - **Visual Consistency:** Follow the established "Golden/Phoenix" theme — same card styles, color variables (`var(--primary)`, `var(--card-bg)`, etc.), and typography as other modules.
    - Date range filter bar at the top.
    - Summary cards in a responsive grid below the filter.
    - Charts section with 2×2 grid on desktop, stacking vertically on mobile.
    - Recent Activity feed below the charts.
- **Mobile Optimization (breakpoint: 768px):**
    - Summary cards stack vertically in a single column.
    - Charts stack vertically below the cards (full-width).
    - Date range filter inputs and preset buttons stack/wrap.
    - Recent activity feed remains as a vertical list.
    - All text and values remain readable without horizontal scrolling.
- **Loading States:** Show `Loading...` text while data is being fetched (matching existing pattern in `InventoryStatusCards.tsx` and `ClientList.tsx`).
- **Error Handling:** Graceful fallback if any API call fails — show error message per section, not a full-page error.

---

## Database Schema (Actual Column Definitions)

> These are the actual tables/views from the Supabase database. All queries in the dashboard module must use these exact column names.

### `products` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `name` | TEXT | `'Noodles'` or `'Momos'` |
| `sales_unit` | TEXT | `'pack'` or `'piece'` |
| `price_per_unit` | DECIMAL(10,2) | Default price |
| `inventory_item_id` | UUID | FK → `inventory_items(id)`, nullable |
| `created_at` | TIMESTAMPTZ | Auto |

### `sales` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `product_id` | UUID | FK → `products(id)` |
| `client_id` | UUID | FK → `clients(id)`, nullable |
| `quantity` | INTEGER | Must be > 0 |
| `unit_price` | DECIMAL(10,2) | Price per unit at time of sale |
| `total_amount` | DECIMAL(12,2) | **Generated column** = `quantity * unit_price` |
| `sale_date` | DATE | Date of sale |
| `created_by` | UUID | FK → `auth.users(id)` |
| `created_at` | TIMESTAMPTZ | Auto |

### `expense_categories` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `name` | TEXT | Category name (unique) |
| `is_archived` | BOOLEAN | Default `false` |
| `created_by` | UUID | FK → `auth.users(id)` |
| `created_at` | TIMESTAMPTZ | Auto |

### `expenses` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `category_id` | UUID | FK → `expense_categories(id)` |
| `description` | TEXT | Nullable |
| `amount` | INTEGER | Whole number in PKR (was DECIMAL, altered to INTEGER) |
| `expense_date` | DATE | Date of expense |
| `created_by` | UUID | FK → `auth.users(id)` |
| `created_at` | TIMESTAMPTZ | Auto |

### `clients` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `name` | TEXT | Client name |
| `phone` | TEXT | Nullable |
| `is_archived` | BOOLEAN | Default `false` |
| `created_at` | TIMESTAMPTZ | Auto |

### `client_payments` table
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | PK |
| `client_id` | UUID | FK → `clients(id)` |
| `amount` | DECIMAL(12,2) | Payment amount |
| `payment_date` | DATE | Date of payment |
| `notes` | TEXT | Nullable |
| `created_by` | UUID | FK → `auth.users(id)` |
| `created_at` | TIMESTAMPTZ | Auto |

### `client_summary` VIEW
| Column | Type | Source |
|--------|------|--------|
| `id` | UUID | `clients.id` |
| `name` | TEXT | `clients.name` |
| `phone` | TEXT | `clients.phone` |
| `created_at` | TIMESTAMPTZ | `clients.created_at` |
| `is_archived` | BOOLEAN | `clients.is_archived` |
| `total_bought` | DECIMAL | `SUM(sales.total_amount)` |
| `total_paid` | DECIMAL | `SUM(client_payments.amount)` |
| `current_dues` | DECIMAL | `total_bought - total_paid` |

### `inventory_stock` VIEW
| Column | Type | Source |
|--------|------|--------|
| `id` | UUID | `inventory_items.id` |
| `name` | TEXT | `inventory_items.name` |
| `unit` | TEXT | `inventory_items.unit` |
| `is_archived` | BOOLEAN | `inventory_items.is_archived` |
| `current_stock` | DECIMAL | `SUM(purchase + production) - SUM(consumption)` |
