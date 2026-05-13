# Validation Criteria — Expenses Module

## Functional Validation
- [ ] **Category Management:**
    - [ ] Adding a new category makes it immediately available in the "Add Expense" dropdown.
    - [ ] Archiving a category removes it from the "Add Expense" dropdown but keeps it in the history.
    - [ ] Restoring a category makes it available again.
- [ ] **Expense Recording:**
    - [ ] Expenses with valid data save correctly.
    - [ ] Negative or zero amounts are prevented.
    - [ ] Successfully added expenses appear in the history table.
- [ ] **Filtering & History:**
    - [ ] Date range filters correctly limit the table records.
    - [ ] Category filter correctly limits the table records.
    - [ ] "Total Expenses" summary updates correctly as filters are applied.
- [ ] **CRUD Operations:**
    - [ ] Expenses can be deleted, and the total summary updates.

## Security Validation
- [ ] **RLS:** Only authenticated users can manage categories and expenses.
- [ ] **API Protection:** Unauthenticated requests to `/api/expenses/*` are rejected.

## UX & Mobile Validation
- [ ] "Manage Categories" modal works smoothly on mobile.
- [ ] Expense table is responsive (scrolls horizontally or switches layout).
- [ ] Success/Error messages are clear and visible.
- [ ] Loading states are shown during API calls.
