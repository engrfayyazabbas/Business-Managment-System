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
-- Users (handled by Supabase Auth)

-- Products
products (id, name, price_per_unit, created_at)

-- Sales
sales (id, product_id, quantity, unit_price, total_amount, sale_date, created_by, created_at)

-- Expense Categories
expense_categories (id, name, created_by, created_at)

-- Expenses
expenses (id, category_id, description, amount, expense_date, created_by, created_at)

-- Inventory Items
inventory_items (id, name, unit, current_stock, created_at)

-- Inventory Transactions
inventory_transactions (id, item_id, type[purchase|consumption], quantity, notes, transaction_date, created_by, created_at)
```

### Deliverables
- ✅ Running Next.js app (locally + deployed on Vercel)
- ✅ Supabase database with all tables created
- ✅ Base layout with navigation sidebar

---

## Phase 1 — Authentication *(Days 2–3)*

### Goals
- Users can sign up, log in, and log out
- Protected routes — unauthenticated users are redirected to login

### Tasks
- [ ] Create login page (email + password)
- [ ] Create registration page (for initial 2–4 users)
- [ ] Implement Supabase Auth integration
- [ ] Set up auth context/provider for session management
- [ ] Create middleware for protected routes
- [ ] Add user display in header (name + logout button)
- [ ] Seed initial product data (Noodles, Momos)

### Deliverables
- ✅ Working login/registration flow
- ✅ All app pages are protected (require login)
- ✅ User session persists across page refreshes

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
  - `DELETE /api/sales/[id]` — delete a sale record
- [ ] Add edit functionality for sales entries

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
  - Enter quantity
  - Optional notes
  - Date picker
- [ ] Create **Transaction History** page
  - Table of all inventory transactions
  - Filter by item, type, date
- [ ] Build API routes
  - `GET /api/inventory` — current stock levels
  - `POST /api/inventory/items` — add new inventory item
  - `POST /api/inventory/transactions` — record transaction
  - `GET /api/inventory/transactions` — list transactions
- [ ] Auto-update `current_stock` on each transaction

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
  - Today's Expenses
  - Today's Profit/Loss
  - Current Inventory Status (Flour kg, Packaging pcs)
- [ ] **Sales Trend Chart** (Line chart)
  - Daily/weekly/monthly sales over time
  - Toggle between Noodles, Momos, or Combined
- [ ] **Expense Breakdown Chart** (Doughnut/Pie chart)
  - Expenses by category for selected period
- [ ] **Profit & Loss Chart** (Bar chart)
  - Revenue vs Expenses side by side
  - Daily/weekly/monthly toggle
- [ ] **Recent Activity Feed**
  - Last 10 actions (sales, expenses, inventory changes)
- [ ] **Date Range Selector**
  - Today / This Week / This Month / Custom Range
- [ ] Build aggregation API routes
  - `GET /api/dashboard/summary` — key metrics
  - `GET /api/dashboard/sales-trend` — time-series data
  - `GET /api/dashboard/expense-breakdown` — category totals
  - `GET /api/dashboard/profit-loss` — revenue vs expenses

### Deliverables
- ✅ At-a-glance understanding of business health
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
- ✅ Fully functional, bug-free production app
- ✅ Accessible at a public URL
- ✅ All team members have accounts and can use the app

---

## Post-Launch (Future Enhancements)

These are **not in scope** for v1.0 but may be added later based on business needs:

| Feature | Priority | Notes |
|---------|----------|-------|
| Export data to Excel/CSV | Medium | Monthly reports for accountant |
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
