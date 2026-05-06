# 🐉 GoldenPhoenix Noodles — Business Management System

A lightweight, web-based management system built for **GoldenPhoenix Noodles** — a small food business specializing in Noodles and Momos. Track daily sales, manage client dues, monitor inventory, and visualize business performance from a single dashboard.

---

## 🚀 Current Status: Active Development

The core infrastructure and primary modules (Sales, Clients, Inventory) are now functional. We are currently working on Expense tracking and Dashboard analytics.

---

## 🎯 What It Does

| Module | Status | Description |
|--------|--------|-------------|
| **Authentication** | ✅ Done | Secure login for authorized staff via Supabase Auth. |
| **Sales Tracking** | ✅ Done | Record daily noodle and momo sales with quantity, price, and client association. |
| **Client Management** | ✅ Done | Manage client database, track outstanding dues, and record payments. |
| **Inventory Monitoring** | ✅ Done | Track raw materials (Flour, Packaging) and Finished Goods production/consumption. |
| **Expense Management** | 🏗️ WIP | Log expenses under customizable categories (UI in progress). |
| **Dashboard & Analytics** | 🔲 Pending | Interactive charts for sales trends, expense breakdowns, and profit/loss analysis. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (React) |
| Styling | Vanilla CSS + CSS Variables |
| Backend | Next.js API Routes (Server Components & Server Actions) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |

---

## 📁 Project Structure

```
Business Managment System/
├── src/
│   ├── app/                # Next.js App Router (Pages & API)
│   ├── components/         # Reusable UI components
│   ├── utils/              # Supabase client and server utilities
│   └── middleware.ts       # Auth protection middleware
├── supabase/
│   └── migrations/         # SQL schema and security policies
├── specs/                  # Project specifications and roadmap
├── public/                 # Static assets
└── README.md               # This file
```

---

## 🗺️ Roadmap

| Phase | Name | Status |
|-------|------|--------|
| 0 | Project Setup & Planning | ✅ Completed |
| 1 | Authentication & Database | ✅ Completed |
| 2 | Sales Module | ✅ Completed |
| 3 | Client & Dues Module | ✅ Completed |
| 4 | Expenses Module | 🏗️ In Progress |
| 5 | Inventory Module | ✅ Completed |
| 6 | Dashboard & Analytics | 🔲 Not Started |
| 7 | Polish & Deployment | 🔲 Not Started |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- Supabase project

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/engrfayyazabbas/goldenphoenix-bms.git
   cd goldenphoenix-bms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see the app.

---

## 📄 Documentation

- [Mission & Vision](specs/mission.md) — Project goals and scope
- [Roadmap](specs/roadmap.md) — Detailed development timeline
- [Tech Stack](specs/stack-tech.md) — Implementation details

---

## 📝 License

This project is private and built for GoldenPhoenix Noodles internal use.
