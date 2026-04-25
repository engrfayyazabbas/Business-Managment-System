# 🗺️ GoldenPhoenix Noodles — Development Roadmap

## Timeline Overview

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 0 | Project Setup & Planning | 1 day | 🔲 Not Started |
| 1 | Authentication & Database | 2 days | 🔲 Not Started |
| 2 | Sales Module | 2 days | 🔲 Not Started |
| 3 | Expenses Module | 2 days | 🔲 Not Started |
| 4 | Inventory Module | 2 days | 🔲 Not Started |
| 5 | Dashboard & Analytics | 3 days | 🔲 Not Started |
| 6 | Polish, Testing & Deployment | 2 days | 🔲 Not Started |

**Estimated Total: ~14 working days (2–3 weeks)**

> ⚠️ *Timeline assumes focused full-time work. For part-time development, add a 50% buffer (~4 weeks total).*

---

## Phase 0 — Project Setup & Planning *(Day 1)*

### Goals
- Initialize project structure
- Set up development environment
- Configure database and hosting

### Tasks
- [ ] Initialize Next.js 14 project with App Router
- [ ] Set up Git repository and push to GitHub
- [ ] Create Supabase project and configure environment variables
- [ ] Design and create database schema (tables, relationships)
- [ ] Set up CSS design system (variables, resets, typography)
- [ ] Create base layout component (sidebar navigation, header)
- [ ] Configure Vercel deployment (auto-deploy from GitHub)

### Database Schema (Initial)

```sql
-- =============================================
-- Users: Handled by Supabase Auth (auth.users)
-- No custom users table needed.
-- =============================================

-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sales_unit TEXT NOT NULL,          -- 'pack' for Noodles, 'piece' for Momos
  price_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  cost_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  -- COGS (Cost of Goods Sold)
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Sales
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Expense Categories
CREATE TABLE expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Expenses
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Items
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,               -- 'kg', 'pieces', 'packs', etc.
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'consumption')),
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL, -- Link to expenses for 'purchase' types
  notes TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Computed View: Current stock levels (derived, not stored)
-- Stock = SUM(purchases) - SUM(consumptions)
CREATE VIEW inventory_stock AS
SELECT
  i.id,
  i.name,
  i.unit,
  COALESCE(SUM(CASE WHEN t.type = 'purchase' THEN t.quantity ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN t.type = 'consumption' THEN t.quantity ELSE 0 END), 0)
  AS current_stock
FROM inventory_items i
LEFT JOIN inventory_transactions t ON t.item_id = i.id
GROUP BY i.id, i.name, i.unit;
```

> **Note:** `current_stock` is **not stored** in `inventory_items`. It is computed dynamically via the `inventory_stock` view (sum of purchases minus consumptions). This prevents data sync issues.

### Row-Level Security (RLS) Policy

> **All authenticated users can read and write all rows.** No row-level user restrictions. Since all 2–4 users have equal access, the RLS policy is simple:

```sql
-- Example RLS policy (applied to each table)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
-- Repeat for: sales, expense_categories, expenses, inventory_items, inventory_transactions
```

### Deliverables
- ✅ Running Next.js app (locally + deployed on Vercel)
- ✅ Supabase database with all tables created and RLS enabled
- ✅ Base layout with navigation sidebar

---

## Phase 1 — Authentication *(Days 2–3)*

### Goals
- Users can sign up, log in, and log out
- Protected routes — unauthenticated users are redirected to login

### Tasks
- [ ] Create login page (email + password)
- [ ] Implement Supabase Auth integration with `@supabase/ssr`
- [ ] Set up auth context/provider for session management
- [ ] Create middleware for protected routes
- [ ] Add user display in header (name + logout button)
- [ ] Seed initial product and inventory data (see below)
- [ ] Create initial user accounts via Supabase Dashboard (no public registration)

### Seed Data

```sql
-- Insert products
INSERT INTO products (name, sales_unit, price_per_unit, cost_per_unit) VALUES
  ('Noodles', 'pack', 0.00, 0.00),   -- Owner sets actual price/cost
  ('Momos', 'piece', 0.00, 0.00);    -- Owner sets actual price/cost

-- Insert initial inventory items
INSERT INTO inventory_items (name, unit) VALUES
  ('Flour', 'kg'),
  ('Packaging', 'packs');
```

> **Note:** The owner should update prices and costs after initial setup.

### Deliverables
- ✅ Working login flow (no public registration page)
- ✅ All app pages are protected (require login)
- ✅ User session persists across page refreshes
- ✅ Products and inventory items seeded in database

---

## Phase 2 — Sales Module *(Days 4–5)*

### Goals
- Record daily sales for Noodles and Momos
- View sales history with date filtering

### Tasks
- [ ] Create **Add Sale** form
  - Select product (Noodles / Momos)
  - Enter quantity sold
  - Enter unit price (with default from product)
  - Auto-calculate total amount
  - Date picker (defaults to today)
- [ ] Create **Sales History** page
  - Table view of all sales records
  - Filter by date range
  - Filter by product
  - Show totals at bottom
- [ ] Build API routes
  - `POST /api/sales` — create new sale
  - `GET /api/sales` — list sales (with date/product filters)
  - `PUT /api/sales/[id]` — update a sale record
  - `DELETE /api/sales/[id]` — delete a sale record

### Deliverables
- ✅ Staff can record each sale in under 10 seconds
- ✅ Daily sales summary is visible at a glance
- ✅ Sales data persists in Supabase

---

## Phase 3 — Expenses Module *(Days 6–7)*

### Goals
- Track all business expenses with custom categories
- Full CRUD on expense categories

### Tasks
- [ ] Create **Expense Categories Manager**
  - Add new category (e.g., Rent, Salaries, Utilities, Transport, Raw Materials)
  - Delete existing category (with confirmation)
  - List all categories
- [ ] Create **Add Expense** form
  - Select category (from user-created list)
  - Enter description
  - Enter amount
  - Date picker (defaults to today)
- [ ] Create **Expenses History** page
  - Table view of all expenses
  - Filter by date range
  - Filter by category
  - Show totals at bottom
- [ ] Build API routes
  - `POST /api/expenses` — create expense
  - `GET /api/expenses` — list expenses (with filters)
  - `PUT /api/expenses/[id]` — update expense
  - `DELETE /api/expenses/[id]` — delete expense
  - `POST /api/expense-categories` — create category
  - `GET /api/expense-categories` — list categories
  - `DELETE /api/expense-categories/[id]` — delete category

### Deliverables
- ✅ Fully customizable expense categories
- ✅ All expenses logged with category, description, amount, and date
- ✅ Easy filtering and review of past expenses

---

## Phase 4 — Inventory Module *(Days 8–9)*

### Goals
- Track raw material stock (Flour, Packaging)
- Record purchases (stock in) and consumption (stock out)

### Tasks
- [ ] Create **Inventory Dashboard**
  - Show current stock levels for each item
  - Visual indicators (progress bars or cards)
- [ ] Create **Add Inventory Item** form (for future expansion)
  - Name, unit of measurement
- [ ] Create **Record Transaction** form
  - Select item (Flour / Packaging)
  - Transaction type: Purchase (adds stock) or Consumption (reduces stock)
  - **If Purchase:** Show "Amount (PKR)" field to simultaneously create an Expense record
  - **If Consumption:** Hide "Amount" field
  - Enter quantity
  - Optional notes
  - Date picker
- [ ] Implement **Unified Purchase Logic**
  - When a 'purchase' is saved, create an entry in `expenses` first, then use that `id` for `inventory_transactions.expense_id`
- [ ] Create **Transaction History** page
  - Table of all inventory transactions
  - Filter by item, type, date
- [ ] Build API routes
  - `GET /api/inventory` — current stock levels (from `inventory_stock` view)
  - `POST /api/inventory/items` — add new inventory item
  - `PUT /api/inventory/items/[id]` — update inventory item (rename, change unit)
  - `DELETE /api/inventory/items/[id]` — delete inventory item
  - `POST /api/inventory/transactions` — record transaction
  - `GET /api/inventory/transactions` — list transactions
- [ ] Stock is computed dynamically via `inventory_stock` view (no manual sync needed)

### Deliverables
- ✅ Real-time stock levels visible for Flour and Packaging
- ✅ Full transaction history (what was bought, what was used)
- ✅ Extensible — can add new raw materials anytime

---

## Phase 5 — Dashboard & Analytics *(Days 10–12)*

### Goals
- A comprehensive home dashboard showing key business metrics
- Visual charts for sales trends, expense breakdown, and profit/loss

### Tasks
- [ ] **Summary Cards** (top of dashboard)
  - Today's Sales Revenue
  - Today's Gross Profit (Revenue - COGS)
  - Today's Net Profit (Revenue - All Expenses)
  - Current Inventory Status (Flour kg, Packaging pcs)
- [ ] **Sales Trend Chart** (Line chart)
  - Daily/weekly/monthly sales over time
  - Toggle between Noodles, Momos, or Combined
- [ ] **Expense Breakdown Chart** (Doughnut/Pie chart)
  - Expenses by category for selected period
- [ ] **Profit & Loss Chart** (Bar chart)
  - Revenue vs Expenses side by side
  - Include Gross Profit margin line
  - Daily/weekly/monthly toggle
- [ ] **Recent Activity Feed**
  - Last 10 actions (sales, expenses, inventory changes)
- [ ] **Date Range Selector**
  - Today / This Week / This Month / Custom Range
- [ ] Build aggregation API routes
  - `GET /api/dashboard/summary` — key metrics (includes Gross/Net profit)
  - `GET /api/dashboard/sales-trend` — time-series data
  - `GET /api/dashboard/expense-breakdown` — category totals
  - `GET /api/dashboard/profit-loss` — revenue vs expenses

### Deliverables
- ✅ At-a-glance understanding of business health and product margins
- ✅ Interactive charts with time range filtering
- ✅ Dashboard loads in under 2 seconds

---

## Phase 6 — Polish, Testing & Deployment *(Days 13–14)*

### Goals
- Ensure production readiness
- Fix bugs and improve UX

### Tasks
- [ ] **Responsive Design** — test and fix on mobile, tablet, desktop
- [ ] **Error Handling** — graceful error messages for all API failures
- [ ] **Loading States** — skeleton loaders or spinners during data fetches
- [ ] **Form Validation** — prevent empty/invalid submissions
- [ ] **Data Integrity** — prevent negative stock, negative amounts
- [ ] **Cross-browser Testing** — Chrome, Firefox, Edge, Safari
- [ ] **Performance Audit** — Lighthouse score check
- [ ] **CSV/Excel Export** — Implement 'Download as CSV' for Sales and Expenses history
- [ ] **Security Review**
  - Supabase RLS policies on all tables
  - Input sanitization
  - Secure environment variables
- [ ] **Final Deployment**
  - Production environment variables on Vercel
  - Custom domain setup (if purchased)
  - Create initial user accounts for the team
- [ ] **Documentation**
  - Write README.md with setup instructions
  - Create a simple user guide

### Deliverables
- ✅ Fully functional, bug-free production app with data export capabilities
- ✅ Accessible at a public URL
- ✅ All team members have accounts and can use the app

---

## Post-Launch (Future Enhancements)

These are **not in scope** for v1.0 but may be added later based on business needs:

| Feature | Priority | Notes |
|---------|----------|-------|
| Product variants (flavors) | Low | If menu expands |
| Low-stock alerts | Medium | Email/notification when stock is low |
| Multi-branch support | Low | If business expands |
| Receipt/invoice generation | Medium | PDF receipts for large orders |
| Urdu language support | Low | If staff prefers Urdu |
| Mobile app (PWA) | Medium | Install on phone as app |
| Backup & restore | High | Periodic data backups |

---

## Milestone Summary

```
Week 1:  Setup → Auth → Sales Module
         ████████████████░░░░░░░░░░░░░░ 40%

Week 2:  Expenses → Inventory → Dashboard (start)
         ████████████████████████░░░░░░ 70%

Week 3:  Dashboard (finish) → Polish → Deploy 🚀
         ██████████████████████████████ 100%
```

> **Launch Target: ~3 weeks from project start**
