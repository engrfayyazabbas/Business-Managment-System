-- Drop and recreate the inventory_stock view to include the is_archived column
DROP VIEW IF EXISTS inventory_stock;

CREATE VIEW inventory_stock AS
SELECT
  i.id,
  i.name,
  i.unit,
  i.is_archived,
  COALESCE(SUM(CASE WHEN t.type IN ('purchase', 'production') THEN t.quantity ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN t.type = 'consumption' THEN t.quantity ELSE 0 END), 0)
  AS current_stock
FROM inventory_items i
LEFT JOIN inventory_transactions t ON t.item_id = i.id
GROUP BY i.id, i.name, i.unit, i.is_archived;
