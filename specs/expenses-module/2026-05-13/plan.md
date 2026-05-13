# Implementation Plan — Expenses Module

## 1. Database Migration
- [ ] Create a migration file (`YYYYMMDD_add_expense_category_archived.sql`):
    - [ ] Add `is_archived` column to `expense_categories` table.
    - [ ] (Optional) Create a view for expense summaries if complex reporting is needed later.

## 2. API Implementation
- [ ] **Categories API:**
    - [ ] `GET /api/expenses/categories` — List active categories (with an option to include archived).
    - [ ] `POST /api/expenses/categories` — Create a new category.
    - [ ] `PATCH /api/expenses/categories/[id]` — Update category (e.g., toggle `is_archived`).
- [ ] **Expenses API:**
    - [ ] `GET /api/expenses` — Fetch expenses with filters (date range, category).
    - [ ] `POST /api/expenses` — Record a new expense.
    - [ ] `DELETE /api/expenses/[id]` — Remove an expense record.

## 3. Component Development
- [ ] **ManageCategoriesModal:**
    - [ ] Modal UI for listing all categories.
    - [ ] Inline form to add a new category.
    - [ ] Toggle buttons for Archive/Restore.
- [ ] **AddExpenseForm:**
    - [ ] Dropdown for Category (fetching only active categories).
    - [ ] Inputs for Amount, Date, and Description.
    - [ ] Real-time PKR formatting/validation.
- [ ] **ExpensesTable:**
    - [ ] Display columns: Date, Category, Description, Amount.
    - [ ] Delete action with confirmation.
- [ ] **ExpenseFilters:**
    - [ ] Date Range picker.
    - [ ] Category dropdown filter.
- [ ] **ExpenseSummaryCards:**
    - [ ] Simple card showing "Total Expenses" for the filtered view.

## 4. Page Integration
- [ ] Update `src/app/(dashboard)/expenses/page.tsx`:
    - [ ] Implement data fetching for expenses and categories.
    - [ ] **UI Consistency:** Ensure the page layout follows the pattern established in the Clients and Inventory modules:
        - Header with title and "Manage Categories" action button (styled like `btn-manage` in `ClientList`).
        - Summary cards at the top for quick insights (e.g., "Total Monthly Expenses").
        - "Add Expense" form and Filter bar placed above the main data table.
    - [ ] Place the Filter bar above the Expenses Table.

## 5. Mobile Optimization
- [ ] Use Flexbox/Grid for responsive cards.
- [ ] Ensure the "Manage Categories" modal is usable on mobile.
- [ ] Test table readability on narrow screens.
