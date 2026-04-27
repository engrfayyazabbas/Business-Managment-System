# Implementation Plan — Inventory Module

## 1. Database Updates
- [x] Create a migration (`20260426_inventory_module.sql`):
    - [x] Add `inventory_item_id` to `products` table.
    - [x] Update the check constraint on `inventory_transactions.type` to `('purchase', 'consumption', 'production')`.
    - [x] Seed new inventory items for "Noodles Pack" and "Momos".
    - [x] Link existing "Noodles" and "Momos" products to their respective inventory items.

## 2. API Implementation
- [ ] `GET /api/inventory` — Fetch current stock levels from the `inventory_stock` view.
- [ ] `POST /api/inventory/transactions` — Record a manual transaction.
    - [ ] If type is `consumption`, validate that the `quantity` does not exceed the current `inventory_stock` for that item.
    - [ ] Return `400 Bad Request` if stock is insufficient.
- [x] **Automated Stock Deduction & Validation:**
    - [x] Update `POST /api/sales` logic:
        - [x] Before creating a sale, check if the product has an associated `inventory_item_id`.
        - [x] If yes, query the current stock level from `inventory_stock`.
        - [x] If available stock is less than requested quantity, return `400 Bad Request` with "Insufficient Stock" error.
        - [x] After creating a sale, create a corresponding `inventory_transaction` with type `consumption`.

## 3. Component Development
- [ ] **InventoryStatusCards:** Display item name, unit, and current stock.
- [ ] **ProductionForm:** A simplified form for "Today's Made Packs".
- [ ] **TransactionForm:** A comprehensive form for all manual transaction types (Purchase or Consumption).
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