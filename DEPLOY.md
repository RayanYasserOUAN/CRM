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

1. In your Supabase dashboard, go to **Project Settings** → **Database**
2. Under **Connection string**, select **URI**
3. Copy the full `postgresql://` string
4. **Replace `[YOUR-PASSWORD]`** with the database password you set in step 2.1

The string looks like:
```
postgresql://postgres:xxxxxx@db.xxxxxxx.supabase.co:5432/postgres
```

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
| `DATABASE_URL` | The `postgresql://` connection string from Supabase (step 2.2) |
| `JWT_SECRET` | A random secret string (run `openssl rand -base64 32` to generate) |

### 3.4 Override build command

Under **Build and Output Settings**, override the **Build Command** to:

```bash
npx prisma generate && npx prisma migrate deploy && next build
```

This ensures Prisma migrations run before each deployment.

### 3.5 Deploy

Click **Deploy**. Vercel will build and deploy the app.

Once done, you'll get a URL like `https://crm-xxxxxx.vercel.app`.

---

## 4. Post-Deployment — Seed Data

The database is empty after the first deploy. You need to seed it with demo data.

### Option 1: Seed locally via your production DB

Replace `DATABASE_URL` in your local `.env` with the Supabase connection string (temporarily), then run:

```bash
npx prisma db seed
```

Then restore your local `.env` to the local PostgreSQL URL.

### Option 2: Supabase SQL Editor

1. Go to Supabase dashboard → **SQL Editor**
2. Create a seed script. Or use a one-time migration:

In your deployed app, visit `/login` and sign in — you won't be able to yet because no user exists. Run the seed manually.

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
| `PrismaClientInitializationError` | Check `DATABASE_URL` is correct in Vercel env vars |
| `Migration not found` | Make sure `prisma/migrations/` is committed to git |
| `bcryptjs` import error on Vercel | Ensure `serverExternalPackages: ["bcryptjs"]` is in `next.config.ts` |
| Blank page after login | Check browser console for errors; ensure API routes return 200 |
| 401 on API calls | Clear cookies or re-login; token expired |

---

## 7. Demo Credentials

After seeding, log in with:
- **Username:** `admin`
- **Password:** `admin123`
