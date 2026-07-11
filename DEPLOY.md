# Deployment Guide: Vercel + Supabase

This guide walks through deploying FlowCRM to production using **Vercel** (hosting) and **Supabase** (PostgreSQL database).

---

## 1. Prerequisites

- [GitHub](https://github.com) account
- [Vercel](https://vercel.com) account (sign in with GitHub)
- [Supabase](https://supabase.com) account (free tier works)

---

## 2. Supabase — Database Setup

### 2.1 Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**
2. Enter a name (e.g. `crm-db`)
3. Set a secure **Database Password** (save this somewhere)
4. Choose a region close to your users
5. Click **Create new project** (takes ~1 minute)

### 2.2 Get the connection string

Supabase provides two ways to connect. **Always use the pooler** for Vercel.

#### Option A: Connection Pooler (✅ required for Vercel)

The pooler supports **IPv4** and handles concurrency. This is what Vercel needs at runtime.

1. In your Supabase dashboard, go to **Project Settings** → **Database**
2. Under **Connection string**, select the **Pooling** tab
3. Copy the full `postgresql://` string
4. **Replace `[YOUR-PASSWORD]`** with the database password you set in step 2.1

The string looks like:
```
postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-xx.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Use this string for `DATABASE_URL` in Vercel environment variables.

#### Option B: Direct (IPv6 only, won't work on Vercel)

Standard URI on port `5432`. Only works over IPv6 — **will fail** in Vercel builds and serverless functions.

```
postgresql://postgres:xxxxxx@db.xxxxxxx.supabase.co:5432/postgres
```

> **⚠ IPv6 Restriction:** Supabase's managed Postgres only accepts connections over **IPv6**
> on the direct endpoint (port 5432). Vercel uses **IPv4-only** infrastructure, so both the
> **build environment** and **serverless functions** cannot reach it. Always use the pooler
> (port 6543) for Vercel. Migrations must still be run manually via the Supabase SQL Editor
> (see [Section 4.1](#41-supabase-sql-editor-recommended)).

---

## 3. Vercel — App Deployment

### 3.1 Push to GitHub first

Ensure your code is on GitHub:

```bash
git add .
git commit -m "Initial CRM"
git branch -M main
git remote add origin https://github.com/RayanYasserOUAN/CRM.git
git push -u origin main
```

### 3.2 Import into Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New** → **Project**
2. Connect your GitHub account if not already connected
3. Find and select the `CRM` repository
4. Vercel should auto-detect Next.js — keep the default settings

### 3.3 Configure environment variables

In the **Environment Variables** section, add:

| Name | Value |
|---|---|
| `DATABASE_URL` | The **pooling** connection string from Supabase (step 2.2 Option A — port 6543, format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-xx.pooler.supabase.com:6543/postgres?pgbouncer=true`) |
| `JWT_SECRET` | A random secret string (run `openssl rand -base64 32` to generate) |

### 3.4 Override build command

Under **Build and Output Settings**, override the **Build Command** to:

```bash
npx prisma generate && next build
```

> **Note:** `npx prisma migrate deploy` is intentionally **removed** from the build
> command because Vercel build runners cannot connect to Supabase Postgres (IPv6).
> Migrations must be applied manually via the SQL Editor after deploy — see [Section 4.1](#41-supabase-sql-editor-recommended).

### 3.5 Deploy

Click **Deploy**. Vercel will build and deploy the app.

Once done, you'll get a URL like `https://crm-xxxxxx.vercel.app`.

---

## 4. Post-Deployment — Seed Data

The database is empty after the first deploy. You must apply the migration SQL first to create the tables, then seed with demo data.

### Option 1: Supabase SQL Editor (recommended)

> ✅ This is the **only reliable method** because Vercel builds can't reach Supabase
> directly (IPv6). It works from any machine with a browser — no local tools needed.

**Step 1 — Run the migration (creates tables):**

```bash
# Locate this file in your project:
prisma/migrations/20250710000000_init/migration.sql
```

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New query**
3. Open the file above and **copy the entire contents** into the editor
4. Click **Run** — you should see `NOTICE: CREATE TABLE / PRIMARY KEY` for each table
5. ✅ Verify tables were created: go to **Table Editor** — you should see empty `User`, `Contact`, and `Deal` tables

**Step 2 — Insert seed data:**

```bash
# Locate this file in your project root:
seed.sql
```

1. Open a **new** SQL Editor tab
2. Copy the entire `seed.sql` file and paste it in
3. Click **Run**
4. ✅ Verify data: go to **Table Editor** and check that rows appear in each table

> **⚠ Order matters!** Running `seed.sql` before the migration will fail because
> the tables don't exist yet. Always run the migration SQL first.

### Option 2: Seed locally via your production DB

If your local machine has direct connectivity to Supabase (no IPv6 issues), swap `DATABASE_URL` in `.env` with the Supabase connection string, then:

```bash
npx prisma db seed
```

Then restore your local `.env` to the local PostgreSQL URL.

### Option 3: Vercel CLI

```bash
npm i -g vercel
vercel pull --environment=production
vercel env pull
npx prisma db seed
```

---

## 5. Local Development

For local development, you need a PostgreSQL instance:

### Using Docker (recommended)

```bash
docker run -d \
  --name crm-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=crm \
  -p 5432:5432 \
  postgres:16-alpine
```

Then:

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

### Using Supabase CLI (alternative)

```bash
# Install Supabase CLI, then:
supabase init
supabase start
# Get the local connection string from the output
```

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| `PrismaClientInitializationError` | Check `DATABASE_URL` is correct in Vercel env vars. Make sure you're using the **pooler** connection string (port 6543, `pgbouncer=true`) — the direct URI (port 5432) won't work from Vercel |
| Build fails with `Can't reach database server` | Remove `prisma migrate deploy` from build command (IPv6). Apply migrations via SQL Editor instead |
| Runtime `Can't reach database server` on login | Update `DATABASE_URL` in Vercel env vars to use the **pooler** connection string (port 6543, `?pgbouncer=true`) instead of the direct URI |
| `relation "User" does not exist` | You ran `seed.sql` **before** the migration SQL. Go back and run the migration SQL first (see Section 4.1 Step 1) |
| `Migration not found` | Make sure `prisma/migrations/` is committed to git |
| `bcryptjs` import error on Vercel | Ensure `serverExternalPackages: ["bcryptjs"]` is in `next.config.ts` |
| `Can't reach database server` | Supabase uses **IPv6 only** — Vercel builds can't connect directly. Use **SQL Editor** ([Section 4.1](#41-supabase-sql-editor-recommended)) to run migrations + seed after deploy |
| Blank page after login | Check browser console for errors; ensure API routes return 200 |
| 401 on API calls | Clear cookies or re-login; token expired |

---

## 7. Demo Credentials

After seeding, log in with:
- **Username:** `admin`
- **Password:** `admin123`