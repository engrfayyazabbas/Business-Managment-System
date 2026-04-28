-- Add archived status to inventory items
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Update the inventory_stock view to ignore archived items if desired, 
-- but usually, we want to see stock of archived items if they still have quantity.
-- For now, we just add the column to the table.
