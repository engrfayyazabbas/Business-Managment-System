# Implementation Plan — Inventory Module
# Note:Check if the folllowing code is generated,if not then develop code for it.
## 1. Database Updates
- [x] Create a migration (`20260426_inventory_module.sql`):
    - [x] Add `inventory_item_id` to `products` table.
    - [x] Update the check constraint on `inventory_transactions.type` to `('purchase', 'consumption', 'production')`.
    - [x] Seed new inventory items for "Noodles Pack" and "Momos".
    - [x] Link existing "Noodles" and "Momos" products to their respective inventory items.
- [ ] Create a new migration (`20260427_inventory_triggers.sql`):
    - [ ] Add `sale_id` column to `inventory_transactions` table (foreign key to `sales`, ON DELETE CASCADE) to reliably link automatic transactions.
    - [ ] Create a PostgreSQL function and trigger `BEFORE INSERT OR UPDATE ON sales` to verify available stock from `inventory_stock` view and raise an exception if insufficient.
    - [ ] Create a PostgreSQL function and trigger `AFTER INSERT ON sales` to automatically insert a `consumption` record into `inventory_transactions`.
    - [ ] Create a PostgreSQL function and trigger `AFTER UPDATE ON sales` to adjust the linked `inventory_transactions` record based on the new quantity.

## 2. API Implementation
- [ ] `GET /api/inventory` — Fetch current stock levels from the `inventory_stock` view.
- [ ] `POST /api/inventory/transactions` — Record a manual transaction.
    - [ ] If type is `consumption`, validate that the `quantity` does not exceed the current `inventory_stock` for that item.
    - [ ] Return `400 Bad Request` if stock is insufficient.
- [ ] **Automated Stock Deduction & Validation (via Triggers):**
    - [ ] Remove manual stock check and inventory insert from `POST /api/sales`.
    - [ ] Update `POST /api/sales` and related endpoints to catch PostgreSQL exceptions raised by the new triggers (e.g., "Insufficient stock") and return a `400 Bad Request` with the error message.

## 3. Component Development
- [ ] **InventoryStatusCards:** Display item name, unit, and current stock.
- [ ] **ProductionForm:** A simplified form for "Today's Made Packs" (purely for tracking finished goods entry).
- [ ] **TransactionForm:** A comprehensive form for all manual transaction types (Purchase or Consumption).
- [ ] **InventoryTable:** List of recent transactions with filtering.
- [ ] **AddSaleForm (Updates):**
    - [ ] Fetch available stock for selected product.
    - [ ] Display "Available Stock: X" prominently next to the quantity input.
    - [ ] Show a real-time validation warning if the user enters a quantity greater than available stock.

## 4. Page Integration
- [ ] Update `src/app/(dashboard)/inventory/page.tsx`:
    - [ ] Fetch stock data on mount.
    - [ ] Integrate Status Cards and Production Form at the top.
    - [ ] Integrate Transaction Table at the bottom.

## 5. Validation
- [ ] Verify that saving a sale for "Noodles" automatically reduces "Noodles" stock in the inventory view (via database trigger).
- [ ] Verify that updating a sale's quantity correctly adjusts the inventory stock.
- [ ] Verify that deleting a sale restores the inventory stock.
- [ ] Verify that adding production increases stock.
- [ ] Test mobile responsiveness of stock cards.