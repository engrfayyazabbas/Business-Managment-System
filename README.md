# 🐉 GoldenPhoenix Noodles — Business Management System

A lightweight, web-based management system built for **GoldenPhoenix Noodles** — a small food business selling Noodles and Momos. Track daily sales, manage expenses, monitor inventory, and visualize business performance from a single dashboard.

---

## 🎯 What It Does

| Module | Description |
|--------|-------------|
| **Sales Tracking** | Record daily noodle and momo sales with quantity, price, and auto-calculated totals |
| **Expense Management** | Log expenses under fully customizable categories (create/delete your own) |
| **Inventory Monitoring** | Track raw material stock (Flour, Packaging) with purchase & consumption logs |
| **Dashboard & Analytics** | Interactive charts for sales trends, expense breakdowns, and profit/loss analysis |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (React) |
| Styling | Vanilla CSS + CSS Variables |
| Charts | Chart.js + react-chartjs-2 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel (Free Tier) |

**Monthly Cost: $0**

---

## 👥 Users

- **2–4 users** with equal access
- Email + password authentication
- No admin/staff role distinction — everyone can do everything

---

## 📁 Project Structure

```
Business Managment System/
├── specs/                  # Project specifications
│   ├── mission.md          # Mission, vision, scope, success criteria
│   ├── stack-tech.md       # Technology stack with justifications
│   └── roadmap.md          # Development roadmap (7 phases, ~14 days)
├── README.md               # This file
└── ... (app code coming soon)
```

---

## 🗺️ Roadmap

| Phase | Name | Duration |
|-------|------|----------|
| 0 | Project Setup & Planning | 1 day |
| 1 | Authentication & Database | 2 days |
| 2 | Sales Module | 2 days |
| 3 | Expenses Module | 2 days |
| 4 | Inventory Module | 2 days |
| 5 | Dashboard & Analytics | 3 days |
| 6 | Polish, Testing & Deployment | 2 days |

**Estimated Total: ~14 working days (2–3 weeks)**

> See [specs/roadmap.md](specs/roadmap.md) for detailed task breakdown.

---

## 🚀 Getting Started

> ⚠️ **Project is in the planning phase.** The app has not been built yet. Check back soon!

### Prerequisites

- Node.js 20+
- npm
- Git
- Supabase account (free)
- Vercel account (free)

### Setup (coming soon)

```bash
# Clone the repository
git clone https://github.com/your-username/goldenphoenix-bms.git
cd goldenphoenix-bms

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and keys

# Run development server
npm run dev
```

---

## 📄 Documentation

- [Mission & Vision](specs/mission.md) — What and why
- [Tech Stack](specs/stack-tech.md) — How and with what
- [Roadmap](specs/roadmap.md) — When and in what order

---

## 📝 License

This project is private and built for GoldenPhoenix Noodles internal use.
