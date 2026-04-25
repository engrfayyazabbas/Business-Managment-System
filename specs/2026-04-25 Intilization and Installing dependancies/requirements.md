# Requirements — Phase 0: Project Setup & Planning

## Scope
The goal of this phase is to establish the foundation of the GoldenPhoenix Noodles Management System. This includes initializing the development environment, configuring the database connection, and creating the core UI structure.

## Technical Decisions
- **Framework:** Next.js 14 (App Router) - For modern React features and efficient routing.
- **Language:** TypeScript - Recommended for AI-assisted development to ensure type safety and better code quality.
- **Styling:** Vanilla CSS + CSS Variables - Lightweight, no extra dependencies, and full control over design as per `stack-tech.md`.
- **Database:** Supabase (PostgreSQL) - Handles storage and authentication.
- **Project Structure:** Root-level initialization for a clean repository layout.

## Context
GoldenPhoenix Noodles needs a system to replace manual bookkeeping. Phase 0 is the "blueprint and foundation" phase. Before we can build the sales or inventory modules, we need a working environment where data can be saved and pages can be rendered.

## Key Constraints
- Must use Next.js 14 (pinned version).
- Must avoid Tailwind CSS or external component libraries.
- Must follow the initial schema defined in `roadmap.md`.
