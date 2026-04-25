# Requirements — Authentication Implementation

## Scope
Implement a complete authentication system using Supabase Auth to secure the GoldenPhoenix Noodles management system.

## Key Decisions
- **Provider:** Supabase Auth (Email/Password).
- **Integration:** Use `@supabase/ssr` for robust session handling in Next.js 14 App Router.
- **Route Protection:** Use Next.js Middleware to enforce authentication for all private routes.
- **Registration:** Public sign-up is disabled. All users must be created manually via the Supabase Dashboard.
- **User Experience:**
    - Unauthenticated users accessing protected routes are redirected to `/login`.
    - Authenticated users accessing `/login` are redirected to the dashboard (`/`).
    - Session state is shared via a React Context Provider.

## Relevant Context
- Pakistan Rupee (PKR) is the currency, though not directly relevant to Auth, it's the project standard.
- The system supports 2–4 users with equal access (no role-based permissions required for v1).
- The database schema already includes `created_by` fields referencing `auth.users(id)`.
