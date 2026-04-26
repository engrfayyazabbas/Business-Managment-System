# Validation Criteria — Inventory Module

## Functional Validation
- [ ] **Dynamic Stock Update:**
    - [ ] Action: Record a sale of 10 packs of Noodles.
    - [ ] Expectation: Inventory for "Noodles" decreases by 10.
- [ ] **Production Entry:**
    - [ ] Action: Enter 50 packs made today.
    - [ ] Expectation: Inventory for "Noodles" increases by 50.
- [ ] **Raw Material Tracking:**
    - [ ] Action: Record purchase of 50kg Flour.
    - [ ] Expectation: Inventory for "Flour" increases, and an Expense record is optionally created.
- [ ] **Accuracy:**
    - [ ] Stock levels correctly aggregate all transaction types (Production + Purchase - Consumption).

## Technical Validation
- [ ] **Triggers/API Logic:** Sale recording and inventory deduction occur within the same transaction or guaranteed sequence.
- [ ] **Constraints:** `inventory_transactions` correctly accepts `production` type.

## UX Validation
- [ ] **Clarity:** Inventory page clearly distinguishes between Raw Materials and Finished Goods.
- [ ] **Mobile:** Stock cards stack vertically on mobile screens.
- [ ] **Feedback:** Success message shown after recording production.