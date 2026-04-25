# Validation Plan — Phase 0

How to know Phase 0 is successfully completed:

## 1. Project Health
- [ ] `npm run dev` starts the development server without errors.
- [ ] `npm run build` completes successfully.
- [ ] No linting errors (`npm run lint`).

## 2. Functional Requirements
- [ ] The Home page (`/`) loads and displays the Base Layout.
- [ ] Sidebar navigation is visible and contains links to Sales, Expenses, and Inventory.
- [ ] Clicking navigation links updates the URL and displays the respective placeholder pages.

## 3. Technical Standards
- [ ] `package.json` contains Next.js 14 and Supabase dependencies.
- [ ] TypeScript types are used for core components (no `any` types).
- [ ] CSS Variables are used for primary colors and spacing.
- [ ] `.env.local` exists (but is ignored by Git) with the required keys.

## 4. Documentation
- [ ] The SQL schema in the project matches the one defined in `specs/roadmap.md`.
