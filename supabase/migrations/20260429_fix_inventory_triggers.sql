-- Fix check_stock_before_sale function
CREATE OR REPLACE FUNCTION check_stock_before_sale()
RETURNS TRIGGER AS $$
DECLARE
    item_stock NUMERIC;
    item_name TEXT;
BEGIN
    -- Get product name
    SELECT name INTO item_name FROM products WHERE id = NEW.product_id;

    -- Get current stock from inventory_stock view
    -- We need to join with products to link product_id to inventory_item_id
    SELECT s.current_stock INTO item_stock
    FROM inventory_stock s
    JOIN products p ON p.inventory_item_id = s.id
    WHERE p.id = NEW.product_id;

    -- If the product is not linked to inventory, we skip stock check
    IF item_stock IS NOT NULL THEN
        IF item_stock < NEW.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for %. Available: %, Requested: %', item_name, item_stock, NEW.quantity;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix create_inventory_transaction_after_sale function
CREATE OR REPLACE FUNCTION create_inventory_transaction_after_sale()
RETURNS TRIGGER AS $$
DECLARE
    inv_item_id UUID;
BEGIN
    -- Get linked inventory item id
    SELECT inventory_item_id INTO inv_item_id
    FROM products
    WHERE id = NEW.product_id;

    -- If linked, record consumption
    IF inv_item_id IS NOT NULL THEN
        INSERT INTO inventory_transactions (item_id, type, quantity, sale_id, created_by, transaction_date, notes)
        VALUES (inv_item_id, 'consumption', NEW.quantity, NEW.id, NEW.created_by, NEW.sale_date, 'Auto-generated from sale');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fix update_inventory_transaction_after_sale_update function
CREATE OR REPLACE FUNCTION update_inventory_transaction_after_sale_update()
RETURNS TRIGGER AS $$
DECLARE
    inv_item_id UUID;
BEGIN
    -- Get linked inventory item id for the (potentially new) product
    SELECT inventory_item_id INTO inv_item_id
    FROM products
    WHERE id = NEW.product_id;

    UPDATE inventory_transactions
    SET 
        quantity = NEW.quantity,
        transaction_date = NEW.sale_date,
        item_id = inv_item_id
    WHERE sale_id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
