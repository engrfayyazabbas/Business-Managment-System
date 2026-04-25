# Sales Module — Validation Criteria

## Functional Validation
- [ ] **Recording Sales:**
    - [ ] Selecting "Noodles" shows "packs" as the unit.
    - [ ] Selecting "Momos" shows "pieces" as the unit.
    - [ ] Entering quantity and unit price correctly calculates the total.
    - [ ] Clicking "Save" displays a success message.
    - [ ] Data is correctly saved in the Supabase `sales` table with the correct `created_by` ID.
- [ ] **Sales History:**
    - [ ] New sales appear in the history table immediately or after refresh.
    - [ ] Date range filtering correctly limits the displayed records.
    - [ ] Product filtering correctly limits the displayed records.
    - [ ] Totals at the bottom of the table (if implemented) reflect the filtered data.
- [ ] **CRUD Operations:**
    - [ ] Existing sales can be edited, and changes persist.
    - [ ] Sales can be deleted with a confirmation prompt.

## Security Validation
- [ ] **Authentication:** Unauthenticated users cannot access the Sales page or the `/api/sales` routes.
- [ ] **RLS:** Only authenticated users can perform CRUD operations on the `sales` table.

## UX Validation
- [ ] Form displays error messages for invalid input (e.g., negative quantity).
- [ ] Table is readable on mobile devices.
- [ ] Success message is visible and disappears or can be dismissed.
