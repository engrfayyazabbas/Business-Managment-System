# Requirements — Client & Dues Module

## Scope
The Client & Dues Module allows the business to maintain a record of regular customers, track sales made on credit, and manage the collection of payments to clear outstanding dues.

## Key Decisions
- **Client Persistence:** Clients are pre-registered in the system. Sales can be associated with these clients to automatically track "Dues".
- **Dues Calculation:** `Dues = Total Order Amount - Total Payments Received`.
- **Payment Records:** Every time a client pays, a record is created in the `client_payments` table. Partial payments are supported.
- **Optional Association:** Sales can still be "Cash Sales" (no client associated), in which case no dues are tracked for that transaction.
- **Client Identification:** Store Client Name and Phone Number (required for follow-ups).
- **History Tracking:**
    - Order history (what did they buy and when).
    - Payment history (when did they pay and how much).

## User Experience
- A dedicated **Clients** page listing all clients with their current balance.
- A **Client Detail** page showing a chronological feed of orders and payments.
- A **Record Payment** button accessible from the client list or detail page.
- Search/Filter clients by name or phone.

## Data Model
- `clients`: `id`, `name`, `phone`, `created_at`.
- `client_payments`: `id`, `client_id`, `amount`, `payment_date`, `notes`, `created_by`.
- Modified `sales`: Add `client_id` (UUID, nullable).
- `client_summary` (View): Aggregates total sales and total payments to show `current_dues`.