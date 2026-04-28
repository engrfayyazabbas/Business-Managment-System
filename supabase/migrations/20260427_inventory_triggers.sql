-- Add sale_id to inventory_transactions
ALTER TABLE inventory_transactions
ADD COLUMN sale_id UUID REFERENCES sales(id) ON DELETE CASCADE;

-- Function to check stock before sale
CREATE OR REPLACE FUNCTION check_stock_before_sale()
RETURNS TRIGGER AS $$
DECLARE
    item_stock NUMERIC;
    item_name TEXT;
BEGIN
    SELECT name INTO item_name FROM products WHERE id = NEW.product_id;

    SELECT quantity INTO item_stock
    FROM inventory_stock
    WHERE product_id = NEW.product_id;

    IF item_stock IS NULL OR item_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for %', item_name;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check stock before sale
CREATE TRIGGER before_sale_check_stock
BEFORE INSERT OR UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION check_stock_before_sale();

-- Function to create inventory transaction after sale
CREATE OR REPLACE FUNCTION create_inventory_transaction_after_sale()
RETURNS TRIGGER AS $$
DECLARE
    inv_item_id UUID;
BEGIN
    SELECT inventory_item_id INTO inv_item_id
    FROM products
    WHERE id = NEW.product_id;

    IF inv_item_id IS NOT NULL THEN
        INSERT INTO inventory_transactions (inventory_item_id, type, quantity, sale_id)
        VALUES (inv_item_id, 'consumption', NEW.quantity, NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create inventory transaction after sale
CREATE TRIGGER after_sale_create_inventory_transaction
AFTER INSERT ON sales
FOR EACH ROW
EXECUTE FUNCTION create_inventory_transaction_after_sale();

-- Function to update inventory transaction after sale update
CREATE OR REPLACE FUNCTION update_inventory_transaction_after_sale_update()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory_transactions
    SET quantity = NEW.quantity
    WHERE sale_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update inventory transaction after sale update
CREATE TRIGGER after_sale_update_inventory_transaction
AFTER UPDATE ON sales
FOR EACH ROW
EXECUTE FUNCTION update_inventory_transaction_after_sale_update();
