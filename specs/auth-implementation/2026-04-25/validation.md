# Validation Criteria — Authentication

## Manual Test Cases

### 1. Unauthenticated Access
- [ ] **Action:** Navigate to `http://localhost:3000/`.
- [ ] **Expectation:** Automatically redirected to `/login`.
- [ ] **Action:** Navigate to `http://localhost:3000/sales`.
- [ ] **Expectation:** Automatically redirected to `/login`.

### 2. Login Flow
- [ ] **Action:** Enter valid credentials (created via Supabase Dashboard).
- [ ] **Expectation:** Successfully logged in and redirected to `/`.
- [ ] **Action:** Enter invalid credentials.
- [ ] **Expectation:** Error message displayed; remains on `/login`.

### 3. Authenticated Access
- [ ] **Action:** While logged in, navigate to `/login`.
- [ ] **Expectation:** Automatically redirected to `/`.
- [ ] **Action:** Refresh any protected page.
- [ ] **Expectation:** User remains logged in; no flash of login screen.

### 4. Logout Flow
- [ ] **Action:** Click the "Logout" button in the header.
- [ ] **Expectation:** Session is cleared; redirected to `/login`.

## Technical Checks
- [ ] `@supabase/ssr` cookies are correctly set in the browser.
- [ ] Middleware handles session refreshing as per Supabase documentation.
- [ ] No public registration routes are accessible.
