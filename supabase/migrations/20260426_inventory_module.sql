-- 1. Add inventory_item_id to products table
ALTER TABLE products ADD COLUMN inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE SET NULL;

-- 2. Update inventory_transactions type constraint
ALTER TABLE inventory_transactions DROP CONSTRAINT inventory_transactions_type_check;
ALTER TABLE inventory_transactions ADD CONSTRAINT inventory_transactions_type_check CHECK (type IN ('purchase', 'consumption', 'production'));

-- 3. Update inventory_stock view to include production
CREATE OR REPLACE VIEW inventory_stock AS
SELECT
  i.id,
  i.name,
  i.unit,
  COALESCE(SUM(CASE WHEN t.type IN ('purchase', 'production') THEN t.quantity ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN t.type = 'consumption' THEN t.quantity ELSE 0 END), 0)
  AS current_stock
FROM inventory_items i
LEFT JOIN inventory_transactions t ON t.item_id = i.id
GROUP BY i.id, i.name, i.unit;

-- 4. Seed new inventory items for finished goods if they don't exist
INSERT INTO inventory_items (name, unit) 
VALUES 
  ('Noodles Pack', 'pack'),
  ('Momos', 'piece')
ON CONFLICT (name) DO NOTHING;

-- 5. Link existing products to inventory items
UPDATE products SET inventory_item_id = (SELECT id FROM inventory_items WHERE name = 'Noodles Pack') WHERE name = 'Noodles';
UPDATE products SET inventory_item_id = (SELECT id FROM inventory_items WHERE name = 'Momos') WHERE name = 'Momos';
