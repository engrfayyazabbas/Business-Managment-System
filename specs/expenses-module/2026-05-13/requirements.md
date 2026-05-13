# Requirements — Expenses Module

## Scope
The Expenses Module allows the business to track all outgoing costs, categorize them for better financial analysis, and maintain a historical record of spending.

## Key Features
- **Expense Categorization:** Every expense must be assigned to a category (e.g., Rent, Salaries, Utilities, Raw Materials).
- **Category Management:**
    - Users can add new expense categories.
    - Users can archive categories that are no longer in use (to keep dropdowns clean).
    - Users can restore archived categories.
    - Accessible via a "Manage Categories" button on the Expenses page.
- **Expense Recording:**
    - Log expenses with Category, Amount (PKR), Date, and optional Description.
    - Default date is the current date.
- **Expense History:**
    - A searchable and filterable list of all recorded expenses.
    - Filters by Date Range and Category.
- **Financial Summary:**
    - Real-time calculation of total expenses based on the active filters.

## Business Rules
- **Category Persistence:** Categories cannot be deleted if they have linked expenses (use archiving instead).
- **Mandatory Fields:** Category, Amount, and Date are required for every expense.
- **Currency:** All amounts are in Pakistani Rupees (PKR).
- **User Tracking:** Every expense and category is linked to the user who created it (`created_by`).

## User Experience
- **Main Expenses Page:**
    - **Visual Consistency:** The layout must mirror the Clients and Inventory modules, utilizing the same "Golden/Phoenix" theme, card-based summaries, and standardized button styles (e.g., `btn-manage`).
    - Summary cards showing total expenses (Filtered).
    - "Add Expense" form (collapsible or modal).
    - "Manage Categories" button.
    - Expenses history table.
- **Mobile Optimization:**
    - Tables must handle horizontal overflow or switch to card views.
    - Forms must be easy to use on small screens.
- **Success Feedback:** Clear messages after adding an expense or updating categories.

## Data Model (Existing in Initial Schema)
- `expense_categories`: `id`, `name`, `created_by`, `created_at`.
- `expenses`: `id`, `category_id`, `description`, `amount`, `expense_date`, `created_by`, `created_at`.

## Planned Data Model Updates
- Add `is_archived` (boolean, default FALSE) to `expense_categories`.
