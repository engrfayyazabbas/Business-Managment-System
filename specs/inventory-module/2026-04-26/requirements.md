# Requirements — Inventory Module

## Scope
The Inventory Module tracks the lifecycle of materials in GoldenPhoenix Noodles. This includes raw materials (e.g., Flour, Packaging) and finished goods (e.g., Noodle packs).

## Key Features
- **Stock Tracking:** Real-time visibility into current stock levels for both raw materials and finished products.
- **Production Recording:** Ability to record "Made packs/pieces" for finished goods (Noodles/Momos).
- **Automated Consumption:** Stock of finished goods is automatically deducted when a sale is recorded.
- **Manual Adjustments:** Record purchases (Stock In) and consumption (Stock Out) for raw materials based on quantity.

## Business Rules
- **Finished Goods Sync:** When "Noodles" are sold, the inventory for "Noodles Pack" must decrease.
- **Stock Validation (Sales):** Sales cannot be recorded if the requested quantity exceeds the available stock of finished goods.
- **Stock Validation (Manual):** Manual "Consumption" transactions for raw materials cannot be recorded if the quantity exceeds the current stock level of raw materials.
- **Production Entry:** Users can manually enter the quantity of packs produced each day.
- **Units:** Support for various units like 'kg', 'packs', 'pieces'.

## Data Model Updates
- **inventory_transactions**: Update `type` to include `production`.
- **products**: Add `inventory_item_id` to link a product to its inventory counterpart.
- **inventory_stock** (View): Remains the same, as `production` and `purchase` both count as "Stock In".

## User Experience
- **Dashboard:** Cards showing current stock with alerts for low stock (future).
- **Forms:**
    - "Add Transaction" form with item selection, type (Purchase/Consumption/Production), and quantity.
    - Simplified "Today's Production" entry on the inventory main page.
- **History:** List of all inventory changes.