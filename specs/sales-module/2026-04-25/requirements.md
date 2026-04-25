# Sales Module — Requirements

## Scope
The Sales Module enables users to record daily sales for GoldenPhoenix Noodles' products (Noodles and Momos) and view a historical log of all transactions.

## Key Decisions
- **Sales Unit Visibility:** The "Add Sale" form will explicitly display the sales unit (e.g., "packs" for Noodles, "pieces" for Momos) based on the selected product to ensure data accuracy.
- **Price Entry:** Unit prices must be entered manually for every sale to accommodate price variability as per business requirements.
- **User Tracking:** Every sale record will be associated with the authenticated user who created it (`created_by`).
- **User Feedback:** A clear success message will be displayed upon successful recording of a sale.
- **Date Defaults:** The sale date will default to the current date but will be adjustable via a date picker.
- **History Filtering:** Users can filter the sales history by date range and product type.

## Context
This is Phase 2 of the GoldenPhoenix Noodles management system development. It builds upon the Authentication and Database setup completed in Phase 1.

## Data Model (Sales Table)
- `id`: UUID (Primary Key)
- `product_id`: UUID (Foreign Key to `products`)
- `quantity`: Integer (Must be > 0)
- `unit_price`: Decimal (Must be >= 0)
- `total_amount`: Decimal (Generated: `quantity * unit_price`)
- `sale_date`: Date (Default: `CURRENT_DATE`)
- `created_by`: UUID (Foreign Key to `auth.users`)
- `created_at`: Timestamptz
