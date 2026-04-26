# 🐉 GoldenPhoenix Noodles — Mission & Vision

## Mission Statement

To provide **GoldenPhoenix Noodles** with a simple, reliable, and affordable web-based management system that empowers the business owner and staff to track daily sales, manage expenses, and monitor inventory — all from a single dashboard — eliminating the need for manual bookkeeping and scattered spreadsheets.

---

## Problem Statement

GoldenPhoenix Noodles is a small food business selling **two products: Noodles and Momos**. Currently, the business faces the following challenges:

| Challenge | Impact |
|---|---|
| Manual record-keeping of daily sales | Prone to errors, time-consuming |
| No centralized expense tracking | Difficult to understand where money is going |
| Inventory tracked informally | Risk of running out of raw materials unexpectedly |
| No profit/loss visibility | Business decisions based on gut feeling, not data |

---

## Target Users

- **Total Users:** 2–4 (small team, equal access)
- **User Roles:** All users share **equal access** — no admin/staff distinction
- **Authentication:** Login with email & password (secured)
- **Registration Strategy:** Public registration is **disabled**. The business owner creates all user accounts manually via the Supabase Dashboard. This ensures only authorized staff can access the system.

---

## Currency

> **All monetary values in the system are in Pakistani Rupees (PKR).**

---

## Core Value Proposition

> **"Know your business numbers at a glance — every sale, every expense, every rupee."**

### What the App Will Do

1. **Track Daily Sales** — Record noodle and momo sales each day with quantities and revenue, linked to specific clients.
2. **Manage Clients & Dues** — Maintain a client database with phone numbers, track outstanding balances (dues), and record payment history.
3. **Manage Expenses** — Categorize and log all business expenses (rent, salaries, utilities, transport, etc.) with full CRUD on categories.
4. **Monitor Inventory** — Track raw material stock levels (Flour, Packaging) with purchase and consumption records.
5. **Visualize Performance** — A full dashboard with charts for profit/loss, sales trends, and expense breakdowns.

### What the App Will NOT Do (Out of Scope)

- ❌ Product variant management (no sub-types/flavors)
- ❌ Low-stock alerts or automated reorder notifications
- ❌ Customer management or CRM features
- ❌ POS (Point of Sale) integration
- ❌ Multi-language support (English only)

---

## Products

| # | Product | Variants | Sales Unit | Notes |
|---|---------|----------|-----------|-------|
| 1 | Noodles | None | Per pack | Tracked by packs sold |
| 2 | Momos | None | Per piece | Tracked by pieces sold |

---

## Raw Materials (Inventory)

| # | Material | Unit | Notes |
|---|----------|------|-------|
| 1 | Flour | kg | Primary raw material |
| 2 | Packaging | pieces/packs | Containers, bags, boxes |

> **Note:** Users may add more raw materials in the future. The system should support adding/removing inventory items.

---

## Data Ownership & Backup

- **Data is owned by GoldenPhoenix Noodles** — stored on Supabase's cloud infrastructure
- **Backup Strategy:** Supabase provides daily automatic backups on paid plans. On the free tier, data can be exported manually via the Supabase Dashboard (CSV/SQL dump)
- **Future Enhancement:** CSV/Excel export feature will be added post-launch for monthly accounting reports
- **Migration Plan:** If Supabase free tier is discontinued, data can be exported and migrated to any PostgreSQL host

---

## Success Criteria

- [ ] All 2–4 users can log in and access the system simultaneously
- [ ] Daily sales for Noodles (per pack) and Momos (per piece) are recorded and viewable
- [ ] Expenses can be created, categorized, edited, and deleted
- [ ] Expense categories are fully customizable (create/delete)
- [ ] Inventory levels for Flour and Packaging are trackable
- [ ] Dashboard displays meaningful charts (profit/loss, sales trends, expense breakdown)
- [ ] App is deployed online and accessible from any device with a browser
- [ ] Total hosting cost is minimal (free or under $5/month)
- [ ] All monetary values displayed in PKR
