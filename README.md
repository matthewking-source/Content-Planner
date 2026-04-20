# Wingate Content Planner

Internal content-planning web app for The Wingate Centre. Plans social, website, email, school outreach, and traditional media (print, press, events) in one shared calendar that syncs in real time across devices.

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Supabase (Postgres + Realtime)
- **Hosting**: Netlify
- **Auth**: none — internal tool, shared URL

## Prerequisites

- Node.js 20+ ([download](https://nodejs.org/))
- A Supabase account (https://supabase.com)
- A Netlify account (https://www.netlify.com)

## 1. Set up Supabase

1. Sign in to Supabase and create a **New Project**.
   - Pick the **EU (West / London / Frankfurt)** region.
   - Save the database password somewhere safe.
2. Wait ~2 minutes for it to provision.
3. In the left sidebar: **SQL Editor → New query**. Paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
4. In the sidebar: **Project settings → API**. Copy:
   - **Project URL** → becomes `VITE_SUPABASE_URL`
   - **anon / public** API key → becomes `VITE_SUPABASE_ANON_KEY`

## 2. Run locally

```bash
# From the project root
cp .env.example .env   # then paste your two values into .env
npm install
npm run dev
```

Open http://localhost:5173.

On the **very first load** against an empty Supabase project, the app auto-seeds 99 content items covering April–June 2026. After that, it never seeds again.

## 3. Deploy to Netlify

1. Push this folder to a Git repo (GitHub recommended) or use **Netlify Drop** with a freshly built `dist/` folder (`npm run build`).
2. In Netlify: **Add new site → Import an existing project** → connect the repo.
3. Build settings are picked up from [`netlify.toml`](netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Under **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Trigger a deploy. Share the Netlify URL with the team.

## Data model

Two tables — see [`supabase/schema.sql`](supabase/schema.sql) for exact DDL.

- `content_items` — the posts, articles, flyers, emails, etc.
- `comments` — polymorphic thread on either an item (`target_type='item'`) or a campaign (`target_type='campaign'`).

Row-level security is enabled with a fully open policy (no auth in the app). If the URL ever leaks, rotate the anon key in Supabase and update Netlify env vars.

## Common tweaks

- **Add a new channel** (e.g. Radio, TikTok): edit [`src/utils/channels.js`](src/utils/channels.js) — a one-line entry with colours.
- **Change the default landing month**: edit `defaultMonth()` in [`src/App.jsx`](src/App.jsx).
- **Re-seed after wiping the DB**: delete all rows in `content_items` (Supabase Table editor → select all → delete). Next load will re-seed.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build locally
