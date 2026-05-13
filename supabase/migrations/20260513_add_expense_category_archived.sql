-- Add is_archived to expense_categories
ALTER TABLE expense_categories ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
