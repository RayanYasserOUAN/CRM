# Deployment Guide: Vercel + Supabase

## Table of Contents

- [Phase 1: Supabase — Create the database](#phase-1-supabase--create-the-database)
- [Phase 2: Vercel — Set environment variables](#phase-2-vercel--set-environment-variables)
- [Phase 3: Deploy the app](#phase-3-deploy-the-app)
- [Phase 4: Seed the database (first time only)](#phase-4-seed-the-database-first-time-only)
- [Phase 5: Redeploy after code changes](#phase-5-redeploy-after-code-changes)
- [Appendix: Local development](#appendix-local-development)
- [Troubleshooting](#troubleshooting)

---

> **Time estimate:** 20 minutes first-time setup, 2 minutes for subsequent redeploys.

---

## Phase 1: Supabase — Create the database

**Do this once.** If you already have a Supabase project running, skip to Phase 2.

### 1.1 Create a project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**
2. Name: `crm-db` (or anything you like)
3. Set a **Database Password** — save it somewhere safe
4. Choose a region close to your users
5. Click **Create new project** (takes ~1 minute)

### 1.2 Copy the database connection string

1. In Supabase Dashboard, go to **Project Settings** → **Database**
2. Under **Connection string**, select the **URI** tab
3. Copy the full `postgresql://` string
4. Replace `[YOUR-PASSWORD]` with the password from step 1.1

You'll end up with something like:

```
postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:5432/postgres
```

Keep this handy — you'll need it in Phase 2.

> **Note:** If your Vercel deployment has IPv6 connectivity issues, use the **Pooling** tab instead (port 6543) and append `?pgbouncer=true` to the URL.

---

## Phase 2: Vercel — Set environment variables

**Do this once.** These variables must exist before the first deploy.

1. Go to [vercel.com](https://vercel.com) → your project **CRM** → **Settings** → **Environment Variables**
2. Add these two variables:

| Name | Value |
|---|---|
| `DATABASE_URL` | The connection string from Phase 1.2 (port 5432) |
| `JWT_SECRET` | Run `openssl rand -base64 32` in your terminal and paste the output |

3. For both, set the scope to **Production** (and Preview if you want preview deployments to work).

### 2.1 Verify the build command

Still in **Settings**, go to **General** → **Build & Development Settings**.

The **Build Command** should be:

```bash
npx prisma generate && next build
```

If it's missing `npx prisma generate &&`, update it now.

> **Note:** Migrations are applied manually via the SQL Editor after deploy — see [Phase 4](#phase-4-seed-the-database-first-time-only).

---

## Phase 3: Deploy the app

### 3.1 Push to GitHub

Your code should already be on GitHub at `https://github.com/RayanYasserOUAN/CRM`. If you've made local changes:

```bash
git add .
git commit -m "your message"
git push
```

### 3.2 Trigger the deploy

Vercel auto-deploys every push to `main`. To check the status:

1. Go to [vercel.com](https://vercel.com) → **CRM** → **Deployments**
2. You should see a new deployment running or completed
3. If it failed, click into it to see the build log
4. If you need to redeploy the latest commit manually, click the three dots (⋮) on the latest deployment → **Redeploy**

Once successful, you'll get a URL like `https://crm-xxxxxx.vercel.app`.

---

## Phase 4: Seed the database (first time only)

After the first deploy, the database is empty. You need to create tables and insert demo data using Supabase's SQL Editor.

### Step 1 — Create tables

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **New query**
3. Open your project file `prisma/migrations/20250710000000_init/migration.sql` and copy the entire contents into the editor
4. Click **Run**
5. Verify: go to **Table Editor** — you should see empty `User`, `Contact`, and `Deal` tables

### Step 2 — Insert seed data

1. Open a **new** SQL Editor tab
2. Open your project file `seed.sql` and copy the entire contents in
3. Click **Run**
4. Verify: go to **Table Editor** and check that rows appear in each table

> **⚠ Order matters!** Running `seed.sql` before the migration will fail. Always run the migration SQL first.

### Demo credentials

After seeding, log in at your deployed URL with:

- **Username:** `admin`
- **Password:** `admin123`

---

## Phase 5: Redeploy after code changes

Once the environment variables and database are set up, every subsequent deployment is just:

```bash
git add .
git commit -m "what you changed"
git push
```

That's it. Vercel detects the push to `main`, builds, and deploys automatically. You don't need to touch Supabase again unless you change the database schema (add a new table, column, etc.) — in that case, also run the new migration SQL via the SQL Editor.

---

## Appendix: Local development

### Prerequisites

- Node.js 18+
- PostgreSQL (Docker recommended)

### Setup

```bash
docker run -d --name crm-pg -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=crm -p 5432:5432 postgres:16-alpine

cp .env.example .env.local
npm install
npx prisma generate
npx prisma migrate dev --name init
npx tsx prisma/seed.ts
npm run dev
```

The app starts at `http://localhost:3000`.

### Tearing down

```bash
docker stop crm-pg
docker rm crm-pg
```

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Build fails | `JWT_SECRET` or `DATABASE_URL` missing in Vercel env vars | Add them in Vercel Dashboard → Settings → Environment Variables |
| Prisma schema validation error: `connection_limit` | Invalid property in `schema.prisma` | Remove `connection_limit` from the datasource block — it's not a valid Prisma property |
| `relation "User" does not exist` | Migration SQL was never run | Go to Supabase SQL Editor and run the migration SQL from Phase 4 Step 1 |
| Blank page after login | API error in browser | Open browser console (F12) and check the network tab for failed requests |
| 401 on API calls | Expired session | Clear cookies and re-login |
| `JWT_SECRET is not set` error on login | Missing env var at runtime | Add `JWT_SECRET` in Vercel env vars and redeploy |











Running build in Washington, D.C., USA (East) – iad1
Build machine configuration: 2 cores, 8 GB
Cloning github.com/RayanYasserOUAN/CRM (Branch: main, Commit: e21f95b)
Cloning completed: 200.000ms
Restored build cache from previous deployment (3py8BKzcZsCUGKzHqHfgURhPCCq8)
Running "vercel build"
Vercel CLI 55.0.0
Installing dependencies...
> crm@0.1.0 postinstall
> prisma generate
Prisma schema loaded from prisma/schema.prisma
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: Property not known: "connection_limit".
