# Implementation Plan — Inventory Module

## 1. Database Updates
- [ ] Create a migration to:
    - [ ] Add `inventory_item_id` to `products` table.
    - [ ] Update the check constraint on `inventory_transactions.type` to `('purchase', 'consumption', 'production')`.
    - [ ] Seed new inventory items for "Noodles" and "Momos".
    - [ ] Link existing "Noodles" and "Momos" products to their respective inventory items.

## 2. API Implementation
- [ ] `GET /api/inventory` — Fetch current stock levels from the `inventory_stock` view.
- [ ] `POST /api/inventory/transactions` — Record a manual transaction (Purchase, Consumption, or Production).
- [ ] **Automated Stock Deduction:**
    - [ ] Update `POST /api/sales` logic:
        - [ ] After creating a sale, check if the product has an associated `inventory_item_id`.
        - [ ] If yes, create a corresponding `inventory_transaction` with type `consumption`.

## 3. Component Development
- [ ] **InventoryStatusCards:** Display item name, unit, and current stock.
- [ ] **ProductionForm:** A simplified form for "Today's Made Packs".
- [ ] **TransactionForm:** A comprehensive form for all transaction types (linked to expenses if 'purchase').
- [ ] **InventoryTable:** List of recent transactions with filtering.

## 4. Page Integration
- [ ] Update `src/app/(dashboard)/inventory/page.tsx`:
    - [ ] Fetch stock data on mount.
    - [ ] Integrate Status Cards and Production Form at the top.
    - [ ] Integrate Transaction Table at the bottom.

## 5. Validation
- [ ] Verify that saving a sale for "Noodles" reduces "Noodles" stock in the inventory view.
- [ ] Verify that adding production increases stock.
- [ ] Test mobile responsiveness of stock cards.