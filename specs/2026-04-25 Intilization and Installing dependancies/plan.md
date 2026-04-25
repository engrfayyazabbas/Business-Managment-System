# Implementation Plan — Phase 0

This plan breaks down Phase 0 into actionable tasks for AI-driven development.

## 1. Project Initialization
- [ ] Run `npx create-next-app@14 . --typescript --eslint --no-tailwind --app --src-dir` to initialize the project in the root.
- [ ] Clean up default Next.js boilerplate (remove default icons, CSS in `globals.css`, and boilerplate content in `page.tsx`).

## 2. Environment Configuration
- [ ] Create `.env.local` based on `.env.example`.
- [ ] Add placeholders for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 3. Database & Auth Setup
- [ ] Create a `supabase/migrations` directory.
- [ ] Save the initial schema from `roadmap.md` into a SQL file (e.g., `20260425_initial_schema.sql`).
- [ ] Install Supabase dependencies: `@supabase/supabase-js` and `@supabase/ssr`.

## 4. Design System & Layout
- [ ] Define global CSS variables in `src/app/globals.css` (Colors: Golden/Phoenix theme, Spacing, Typography).
- [ ] Create a `components/layout` directory.
- [ ] Implement `Sidebar.tsx` and `Header.tsx` components.
- [ ] Update `src/app/layout.tsx` to include the Sidebar and Header.

## 5. Basic Routing
- [ ] Create placeholder pages for Dashboard, Sales, Expenses, and Inventory to test navigation.

## 6. Deployment Prep
- [ ] Verify local build runs with `npm run build`.
- [ ] Prepare for Vercel integration (ensure `package.json` is correct).
