-- Products
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sales_unit TEXT NOT NULL,          -- 'pack' for Noodles, 'piece' for Momos
  price_per_unit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Sales
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Expense Categories
CREATE TABLE expense_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Expenses
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Items
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  unit TEXT NOT NULL,               -- 'kg', 'pieces', 'packs', etc.
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Inventory Transactions
CREATE TABLE inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('purchase', 'consumption')),
  quantity DECIMAL(10, 2) NOT NULL CHECK (quantity > 0),
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL, -- Link to expenses for 'purchase' types
  notes TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Computed View: Current stock levels
CREATE VIEW inventory_stock AS
SELECT
  i.id,
  i.name,
  i.unit,
  COALESCE(SUM(CASE WHEN t.type = 'purchase' THEN t.quantity ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN t.type = 'consumption' THEN t.quantity ELSE 0 END), 0)
  AS current_stock
FROM inventory_items i
LEFT JOIN inventory_transactions t ON t.item_id = i.id
GROUP BY i.id, i.name, i.unit;

-- Enable RLS and set policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON products FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON sales FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON expense_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON expenses FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON inventory_items FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users full access" ON inventory_transactions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed initial data
INSERT INTO products (name, sales_unit, price_per_unit) VALUES
  ('Noodles', 'pack', 0.00),
  ('Momos', 'piece', 0.00);

INSERT INTO inventory_items (name, unit) VALUES
  ('Flour', 'kg'),
  ('Packaging', 'packs');
