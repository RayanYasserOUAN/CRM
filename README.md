# FlowCRM

A modern CRM web app built with Next.js 15, TypeScript, Tailwind CSS 4, and Prisma.

**Features:**
- Dashboard with pipeline overview, stats, and revenue chart
- Contacts management (CRUD)
- Drag-and-drop Kanban deal pipeline (Lead → Contacted → Proposal → Won → Lost)
- JWT-based authentication

**Tech Stack:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma (PostgreSQL)
- Recharts
- Framer Motion + @dnd-kit

## Quick Start

```bash
git clone https://github.com/RayanYasserOUAN/CRM.git
cd CRM

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your PostgreSQL connection string

# Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed the database (1 admin user, 10 contacts, 8 deals)
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

**Demo credentials:** `admin` / `admin123`

See [DEPLOY.md](./DEPLOY.md) for production deployment instructions.
