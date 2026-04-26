# Validation Criteria — Client & Dues Module

## Functional Validation
- [ ] **Client Management:**
    - [ ] Adding a client with name and phone saves correctly.
    - [ ] Client appears in the list with 0 dues initially.
- [ ] **Linked Sales:**
    - [ ] Recording a sale with a client selected increases their dues in the summary view.
    - [ ] Recording a sale *without* a client (Cash Sale) does not affect any client dues.
- [ ] **Payments:**
    - [ ] Recording a payment reduces the client's dues immediately.
    - [ ] Payment history shows the correct date, amount, and notes.
- [ ] **Client Detail View:**
    - [ ] Displays all orders linked to the client.
    - [ ] Displays all payments made by the client.
    - [ ] "Current Dues" math is correct: `Sum(Orders) - Sum(Payments)`.

## Security Validation
- [ ] **RLS:** Authenticated users can read/write to `clients` and `client_payments`.
- [ ] **API Protection:** Unauthenticated users cannot access `/api/clients` or `/api/payments`.

## UX & Mobile Validation
- [ ] Client dropdown in Sales form is searchable (for when the list grows).
- [ ] Client list displays dues in red if > 0.
- [ ] Tables switch to a card-based layout or scroll horizontally on mobile.
- [ ] "Record Payment" flow is quick (under 3 clicks).