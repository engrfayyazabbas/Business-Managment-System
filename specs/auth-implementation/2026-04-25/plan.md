# Implementation Plan — Authentication

## 1. Environment & Utilities
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
- [ ] Create Supabase client factory for Client Components (`src/utils/supabase/client.ts`).
- [ ] Create Supabase client factory for Server Components (`src/utils/supabase/server.ts`).
- [ ] Create Supabase client factory for Middleware (`src/utils/supabase/middleware.ts`).

## 2. Authentication Core
- [ ] Implement Next.js Middleware (`src/middleware.ts`) to:
    - Update session cookies.
    - Redirect unauthenticated users from `/` and sub-pages to `/login`.
    - Redirect authenticated users away from `/login`.
- [ ] Create an `AuthProvider` (`src/components/providers/AuthProvider.tsx`) to manage user state and session persistence on the client side.
- [ ] Wrap `layout.tsx` with the `AuthProvider`.

## 3. UI Implementation
- [ ] Create the Login Page (`src/app/login/page.tsx`):
    - Email and Password form.
    - Loading states and error handling.
    - Basic Vanilla CSS styling.
- [ ] Update the Header component (`src/components/layout/Header.tsx`):
    - Display current user's email.
    - Implement "Logout" button functionality.

## 4. Verification & Cleanup
- [ ] Test the full login/logout flow.
- [ ] Verify route protection for all existing pages (`/`, `/sales`, `/expenses`, `/inventory`).
- [ ] Ensure SSR correctly identifies the user session.
