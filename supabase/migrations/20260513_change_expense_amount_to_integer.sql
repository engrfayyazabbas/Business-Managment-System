-- Change amount in expenses to INTEGER to support only whole numbers
ALTER TABLE expenses ALTER COLUMN amount TYPE INTEGER USING amount::INTEGER;
