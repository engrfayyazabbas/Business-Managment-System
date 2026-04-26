# Implementation Plan — Client & Dues Module

## 1. Database Migration
- [ ] Create migration file:
    - [ ] Create `clients` table.
    - [ ] Add `client_id` to `sales` table.
    - [ ] Create `client_payments` table.
    - [ ] Create `client_summary` view.
    - [ ] Enable RLS and add policies for all new tables.

## 2. API Implementation
- [ ] `GET /api/clients` — list all clients (with summary data).
- [ ] `POST /api/clients` — create a new client.
- [ ] `GET /api/clients/[id]` — fetch client details, order history, and payment history.
- [ ] `POST /api/clients/[id]/payments` — record a new payment.
- [ ] Update `POST /api/sales` — accept `client_id` field.

## 3. Component Development
- [ ] **ClientList:** Table showing Client Name, Phone, and Current Dues.
- [ ] **AddClientForm:** Simple modal or form to add name/phone.
- [ ] **RecordPaymentForm:** Form to enter amount, date, and notes for a specific client.
- [ ] **ClientProfile:** Dashboard-style view for a single client showing:
    - Stats (Total Bought, Total Paid, Dues).
    - Table of Sales.
    - Table of Payments.
- [ ] **Update AddSaleForm:** Add a dropdown to select a client (fetch from `/api/clients`).

## 4. Page Integration
- [ ] Create `src/app/(dashboard)/clients/page.tsx` (List view).
- [ ] Create `src/app/(dashboard)/clients/[id]/page.tsx` (Detail view).
- [ ] Update `src/app/(dashboard)/sales/page.tsx` to pass client selection to the form.

## 5. Mobile Optimization
- [ ] Use CSS Flexbox for "Card" layouts on the client list for mobile.
- [ ] Ensure the "Client Profile" charts/tables are responsive.