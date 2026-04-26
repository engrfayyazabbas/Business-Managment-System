# 🗺️ GoldenPhoenix Noodles — Development Roadmap

## Timeline Overview

| Phase | Name | Duration | Status |
|-------|------|----------|--------|
| 0 | Project Setup & Planning | 1 day | ✅ Completed |
| 1 | Authentication & Database | 2 days | ✅ Completed |
| 2 | Sales Module (Base) | 2 days | ✅ Completed |
| 3 | Client & Dues Module | 3 days | 🔲 Not Started |
| 4 | Expenses Module | 2 days | 🔲 Not Started |
| 5 | Inventory Module | 2 days | 🔲 Not Started |
| 6 | Dashboard & Analytics | 3 days | 🔲 Not Started |
| 7 | Polish, Testing & Deployment | 2 days | 🔲 Not Started |

**Estimated Total: ~17 working days (3–4 weeks)**

---

## Phase 0 — Project Setup & Planning *(Day 1)*
✅ **Completed**

---

## Phase 1 — Authentication *(Days 2–3)*
✅ **Completed**

---

## Phase 2 — Sales Module *(Days 4–5)*
✅ **Completed** (Note: Client association will be retrofitted in Phase 3)

---

## Phase 3 — Client & Dues Module *(Days 6–8)*

### Goals
- Manage a database of clients (Customers)
- Track credit sales (dues) and payments
- Provide a detailed "Client Profile" view

### Database Schema Updates
```sql
-- Clients
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Update Sales to link to Clients
ALTER TABLE sales ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE SET NULL;

-- Client Payments (To track when they pay off dues)
CREATE TABLE client_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- View for Client Dues
CREATE VIEW client_summary AS
SELECT
  c.id,
  c.name,
  c.phone,
  COALESCE(SUM(s.total_amount), 0) AS total_orders_amount,
  COALESCE((SELECT SUM(amount) FROM client_payments WHERE client_id = c.id), 0) AS total_paid_amount,
  COALESCE(SUM(s.total_amount), 0) - COALESCE((SELECT SUM(amount) FROM client_payments WHERE client_id = c.id), 0) AS current_dues
FROM clients c
LEFT JOIN sales s ON s.client_id = c.id
GROUP BY c.id, c.name, c.phone;
```

### Tasks
- [ ] **Client Management UI:**
  - [ ] CRUD for Clients (Name, Phone).
  - [ ] Searchable Client List table.
- [ ] **Retrofitted Sales Flow:**
  - [ ] Update `AddSaleForm` to include a searchable Client dropdown (optional for cash sales).
- [ ] **Payments:**
  - [ ] "Record Payment" form for clients.
  - [ ] List payment history per client.
- [ ] **Client Detail Page:**
  - [ ] Show client info, total dues, and order history.
  - [ ] Show payment history.
- [ ] **Mobile Optimization:** Ensure client lists and payment forms are responsive.

### Deliverables
- ✅ Centralized client database.
- ✅ Ability to track who owes what.
- ✅ History of payments made by clients.

---

## Phase 4 — Expenses Module *(Days 9–10)*

### Goals
- Track all business expenses with custom categories
- Full CRUD on expense categories
- **Ensure all forms and tables are fully mobile-responsive**

### Tasks
- [ ] Create **Expense Categories Manager**
- [ ] Create **Add Expense** form
- [ ] Create **Expenses History** page
- [ ] **Mobile Optimization:** Implement responsive layouts.
- [ ] Build API routes

---

## Phase 5 — Inventory Module *(Days 11–12)*

### Goals
- Track raw material stock (Flour, Packaging)
- **Track Finished Goods stock (Noodles, Momos)**
- **Record daily production (Made packs)**
- **Automated stock deduction from sales**
- **Ensure inventory dashboard and forms are fully mobile-responsive**

### Database Schema Updates (Inventory)
```sql
-- Update inventory_transactions type
ALTER TABLE inventory_transactions DROP CONSTRAINT inventory_transactions_type_check;
ALTER TABLE inventory_transactions ADD CONSTRAINT inventory_transactions_type_check 
  CHECK (type IN ('purchase', 'consumption', 'production'));

-- Link Products to Inventory Items
ALTER TABLE products ADD COLUMN inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL;
```

### Tasks
- [ ] Create **Inventory Dashboard**
  - Show current stock levels for both Raw Materials and Finished Goods.
  - Visual indicators (progress bars or cards).
- [ ] **Dynamic Stock Deduction:**
  - Update `POST /api/sales` to create a `consumption` transaction if product is linked to inventory.
- [ ] Create **Record Production** form (for "Today's Made Packs").
- [ ] Create **Record Transaction** form (Purchase/Consumption).
- [ ] **Mobile Optimization:** Ensure inventory status cards and transaction forms are easy to use on small screens.
- [ ] Implement **Unified Purchase Logic** (Link to expenses).
- [ ] Create **Transaction History** page.

---

## Phase 6 — Dashboard & Analytics *(Days 13–15)*

### Goals
- A comprehensive home dashboard showing key business metrics
- Visual charts for sales trends, expense breakdown, and profit/loss
- **Include Client Dues summary in the dashboard**

---

## Phase 7 — Polish, Testing & Deployment *(Days 16–17)*

### Tasks
- [ ] **Responsive Design** — test and fix on mobile, tablet, desktop
- [ ] **Error Handling** — graceful error messages
- [ ] **Security Review** (RLS for new client tables)
- [ ] **Final Deployment**

---

## Milestone Summary

```
Week 1:  Setup → Auth → Sales (Base)
         ██████████░░░░░░░░░░░░░░░░░░░ 30%

Week 2:  Clients → Expenses → Inventory
         ████████████████████░░░░░░░░░ 60%

Week 3:  Dashboard → Polish → Deploy 🚀
         █████████████████████████████ 100%
```
