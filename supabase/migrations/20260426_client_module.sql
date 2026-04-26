-- 1. Create clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Add client_id to sales table
ALTER TABLE sales
  ADD COLUMN client_id UUID REFERENCES clients(id) ON DELETE RESTRICT;

-- 3. Create client_payments table
CREATE TABLE client_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Create client_summary view
CREATE VIEW client_summary AS
SELECT 
  c.id,
  c.name,
  c.phone,
  c.created_at,
  COALESCE(SUM(s.total_amount), 0) AS total_bought,
  COALESCE(
    (SELECT SUM(cp.amount) FROM client_payments cp WHERE cp.client_id = c.id), 
    0
  ) AS total_paid,
  (COALESCE(SUM(s.total_amount), 0) - COALESCE(
    (SELECT SUM(cp.amount) FROM client_payments cp WHERE cp.client_id = c.id), 
    0
  )) AS current_dues
FROM 
  clients c
LEFT JOIN 
  sales s ON c.id = s.client_id
GROUP BY 
  c.id, c.name, c.phone, c.created_at;

-- 5. Enable RLS and add policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access on clients" 
  ON clients FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE client_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access on client_payments" 
  ON client_payments FOR ALL 
  USING (auth.role() = 'authenticated') 
  WITH CHECK (auth.role() = 'authenticated');
