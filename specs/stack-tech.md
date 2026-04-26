# 🛠️ GoldenPhoenix Noodles — Technology Stack

## Stack Overview

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (React) | Full-stack framework, free Vercel deployment, fast SSR |
| **Styling** | Vanilla CSS + CSS Variables | Full control, no extra dependencies, lightweight |
| **Charts** | Chart.js | Free, lightweight, beautiful charts out of the box |
| **Backend** | Next.js API Routes | No separate server needed — everything in one project |
| **Database** | Supabase (PostgreSQL) | Free tier (500MB), hosted, real-time, built-in auth |
| **Authentication** | Supabase Auth | Free, secure, session-based, built-in with database |
| **Deployment** | Vercel | Free tier, auto-deploy from GitHub, global CDN |
| **Version Control** | Git + GitHub | Free, industry standard |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│            Next.js 14 (React Pages)              │
│  ┌──────────┬──────────┬───────────┬──────────┬──────────┐  │
│  │Dashboard │  Sales   │ Clients   │ Expenses │Inventory │  │
│  │  Page    │  Page    │   Page    │   Page   │  Page    │  │
│  └──────────┴──────────┴───────────┴──────────┴──────────┘  │
│              │  Chart.js for Visuals  │           │
└──────────────┼───────────────────────┼───────────┘
               │    API Calls          │
┌──────────────┼───────────────────────┼───────────┐
│              ▼    BACKEND            ▼           │
│         Next.js API Routes (/api/*)              │
│  ┌──────────┬──────────┬───────────┬──────────┬──────────┐  │
│  │/api/auth │/api/sales│/api/client│/api/exp  │/api/inv  │  │
│  └──────────┴──────────┴───────────┴──────────┴──────────┘  │
└──────────────┼───────────────────────────────────┘
               │    Supabase Client
┌──────────────┼───────────────────────────────────┐
│              ▼    DATABASE                       │
│         Supabase (PostgreSQL)                    │
│  ┌──────────┬──────────┬───────────┬──────────┬──────────┐  │
│  │  users   │  sales   │  clients  │ expenses │inventory │  │
│  │          │          │  payments │ categories│          │  │
│  └──────────┴──────────┴───────────┴──────────┴──────────┘  │
└──────────────────────────────────────────────────┘
```

---

## Detailed Stack Justification

### Frontend — Next.js 14 (Pinned)

- **Why not plain HTML/JS?** The app has multiple pages (dashboard, sales, expenses, inventory), authentication, and API calls. A framework keeps things organized.
- **Why Next.js over Vite+React?** Next.js includes API routes (backend), file-based routing, and free Vercel hosting. No need for a separate backend server.
- **App Router vs Pages Router?** Using **App Router** (default in Next.js 14) for modern React Server Components and better performance.
- **Why Next.js 14 and not 15?** Next.js 14 is chosen for **stability** — it has more community tutorials, broader Supabase integration docs, and well-tested patterns. Upgrading to 15 can be done later when the ecosystem matures.

### Styling — Vanilla CSS

- **No Tailwind, no component libraries.** Keeps the bundle tiny, gives full design control, and avoids version lock-in.
- **CSS Variables** for a consistent design system (colors, spacing, typography).
- **Responsive design** with CSS Grid and Flexbox for mobile/tablet/desktop.
- **Mobile-First Approach:** All modules must be designed to be fully functional and visually appealing on mobile devices first, then scaled for larger screens. This is a core requirement for ensuring usability for staff on-site.

### Charts — Chart.js

- **Free and open-source** (MIT license)
- **Lightweight** (~60KB gzipped) vs alternatives like D3.js
- **Built-in chart types** we need: Bar, Line, Pie/Doughnut
- **Easy React integration** via `react-chartjs-2` wrapper

### Database — Supabase (PostgreSQL)

- **Free tier limits:** 500MB database storage, 1GB file storage, 2GB bandwidth, 50K monthly active users (Auth), unlimited API requests
- **PostgreSQL:** Battle-tested, relational database — perfect for structured business data
- **Built-in Auth:** No need to build login/registration from scratch
- **Dashboard:** Web-based admin panel to view/edit data directly
- **Why not SQLite?** Need online deployment with multiple concurrent users
- **Why not Firebase?** PostgreSQL is better for relational/financial data; Supabase's free tier is more generous

### Authentication — Supabase Auth

- **Email + Password** authentication (simple, no social login complexity)
- **Session management** handled automatically
- **Row-Level Security (RLS)** to protect data at the database level
- **Cost:** $0 (included in Supabase free tier)

### Deployment — Vercel

- **Free tier includes:** 100GB bandwidth, serverless functions, automatic HTTPS
- **One-click deploy** from GitHub repository
- **Preview deployments** for every pull request
- **Global CDN** — fast load times from anywhere
- **Custom domain** support (even on free tier)

---

## Monthly Cost Estimate

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Vercel | Hobby (Free) | **$0** |
| Supabase | Free Tier | **$0** |
| GitHub | Free | **$0** |
| Custom Domain (optional) | .com via Namecheap | ~$1/month |
| **Total** | | **$0 – $1/month** |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| VS Code / Gemini IDE | Code editor |
| Node.js 20+ | JavaScript runtime |
| npm | Package manager |
| Git | Version control |
| Postman (optional) | API testing |
| Supabase Dashboard | Database management |

---

## Key npm Packages

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.5.x",
    "chart.js": "^4.x",
    "react-chartjs-2": "^5.x"
  },
  "devDependencies": {
    "eslint": "^8.x",
    "eslint-config-next": "^14.x"
  }
}
```

> **Total dependencies: 7** — Keeping it minimal and maintainable.
> 
> `@supabase/ssr` is required for proper cookie-based auth with Next.js App Router and Server Components.

---

## Environment Variables

The following variables must be set in `.env.local` for local development and in Vercel's environment settings for production:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key | Supabase Dashboard → Settings → API |

```bash
# .env.local (example)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never commit `.env.local` to Git.** It is already included in `.gitignore`.
