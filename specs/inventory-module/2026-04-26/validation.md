# Validation Criteria — Inventory Module

## Functional Validation
- [ ] **Dynamic Stock Update:**
    - [ ] Action: Record a sale of 10 packs of Noodles.
    - [ ] Expectation: Inventory for "Noodles" decreases by 10.
- [ ] **Insufficient Stock Prevention:**
    - [ ] Action: Attempt to record a sale of 1000 packs when only 100 are in stock.
    - [ ] Expectation: The system prevents the sale and shows an error message "Insufficient Stock".
- [ ] **Production Entry:**
    - [ ] Action: Enter 50 packs made today.
    - [ ] Expectation: Inventory for "Noodles" increases by 50.
- [ ] **Raw Material Tracking:**
    - [ ] Action: Record purchase of 50kg Flour.
    - [ ] Expectation: Inventory for "Flour" increases by 50kg.
- [ ] **Manual Consumption Validation:**
    - [ ] Action: Attempt to record "Consumption" of 60kg Flour when only 50kg is in stock.
    - [ ] Expectation: System prevents the record and shows "Insufficient Stock".
- [ ] **Accuracy:**
    - [ ] Stock levels correctly aggregate all transaction types (Production + Purchase - Consumption).

## Technical Validation
- [ ] **Triggers/API Logic:** Sale recording and inventory deduction occur within the same transaction or guaranteed sequence.
- [ ] **Constraints:** `inventory_transactions` correctly accepts `production` type.

## UX Validation
- [ ] **Clarity:** Inventory page clearly distinguishes between Raw Materials and Finished Goods.
- [ ] **Mobile:** Stock cards stack vertically on mobile screens.
- [ ] **Feedback:** Success message shown after recording production.