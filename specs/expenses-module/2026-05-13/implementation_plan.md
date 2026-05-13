# Implementation Plan — Expenses Module (Detailed)

## Phase 1: Database & API
- [ ] **Database Migration:**
    - Create `supabase/migrations/20260513_add_expense_category_archived.sql`
    - Add `is_archived` to `expense_categories`.
- [ ] **Categories API:**
    - `src/app/api/expenses/categories/route.ts` (GET, POST)
    - `src/app/api/expenses/categories/[id]/route.ts` (PATCH)
- [ ] **Expenses API:**
    - `src/app/api/expenses/route.ts` (GET, POST)
    - `src/app/api/expenses/[id]/route.ts` (DELETE)

## Phase 2: Components
- [ ] `src/components/expenses/ManageCategoriesModal.tsx`
- [ ] `src/components/expenses/AddExpenseForm.tsx`
- [ ] `src/components/expenses/ExpensesTable.tsx`
- [ ] `src/components/expenses/ExpenseFilters.tsx`
- [ ] `src/components/expenses/ExpenseSummaryCards.tsx`

## Phase 3: Page Integration & Validation
- [ ] `src/app/(dashboard)/expenses/page.tsx`
- [ ] Manual testing and validation against `validation.md`.
- [ ] Mobile responsiveness check.
