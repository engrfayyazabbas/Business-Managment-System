-- Update client_summary view to include is_archived
DROP VIEW IF EXISTS client_summary;

CREATE VIEW client_summary AS
SELECT 
  c.id,
  c.name,
  c.phone,
  c.created_at,
  c.is_archived,
  COALESCE(SUM(s.total_amount), 0) as total_bought,
  COALESCE((SELECT SUM(amount) FROM client_payments WHERE client_id = c.id), 0) as total_paid,
  COALESCE(SUM(s.total_amount), 0) - COALESCE((SELECT SUM(amount) FROM client_payments WHERE client_id = c.id), 0) as current_dues
FROM clients c
LEFT JOIN sales s ON c.id = s.client_id
GROUP BY c.id, c.name, c.phone, c.created_at, c.is_archived;
