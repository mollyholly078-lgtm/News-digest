# NewsDigest

AI-curated daily current affairs for competitive exam aspirants (UPSC, PCS, SSC, Banking, Defence).

Built with Next.js 16, Prisma + SQLite, Tailwind CSS v4, and Google Gemini AI.

## Features

- **AI-powered news pipeline** — fetches from 7+ RSS feeds, filters, categorizes, and generates structured UPSC content (summary, background, MCQs, Mains questions)
- **6 Category pages** — India, World, Economy, Science & Tech, Environment, Polity & Governance
- **Daily Quiz** — 15 MCQs with timer, explanations, and score tracking
- **Weekly Revision** — Top 10 stories ranked by UPSC relevance
- **Monthly Magazine** — Category-compiled PDF download
- **Admin Dashboard** — Review, approve, and manage AI-generated articles
- **User authentication** — Custom JWT-based auth with admin/user roles
- **Bookmarks** — Save articles for later

## Getting Started

### Prerequisites

- Node.js 20+
- A [Google AI API key](https://aistudio.google.com/apikey) (for AI news processing)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file and fill in your values
cp .env.example .env.local

# 3. Push DB schema and seed data
npm run db:push
npm run seed

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Default seed accounts

| Email | Password | Role |
|-------|----------|------|
| admin@newsdigest.in | password123 | ADMIN |
| user@newsdigest.in | password123 | USER |

The first user registered via `/register` automatically becomes ADMIN.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed database with sample data |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and apply migrations |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite database path (default: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Yes | Session encryption secret (generate via `openssl rand -base64 32`) |
| `GOOGLE_AI_API_KEY` | For AI features | Google Gemini API key |

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Database:** SQLite via Prisma + better-sqlite3
- **Auth:** Custom JWT (jose) + bcryptjs
- **UI:** Tailwind CSS v4, Lucide React icons
- **AI:** Google Gemini 1.5 Flash
- **PDF:** jsPDF + html2canvas
