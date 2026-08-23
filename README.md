# TKEP2.0 — World Wipe

Homage to [homokaasu.org](https://homokaasu.org) and *The Kill Everyone Project*.

World Wipe is a cooperative global clicking game: players around the world click
to "wipe" countries off an interactive world map, racing toward clearing the
entire globe. Progress is shared and tracked in real time across all players.

## Tech stack

- **[Next.js](https://nextjs.org) 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS** with [shadcn/ui](https://ui.shadcn.com) components (Radix UI primitives)
- **[Supabase](https://supabase.com)** for auth and the shared game database
- **D3 / TopoJSON** for the interactive world map
- Deployed on **Vercel**

## Getting started

The quickest path is a fully local, self-hosted stack via the Supabase CLI:

```bash
# 1. boot Supabase (Postgres + Auth + API) in Docker, then apply schema + seed
supabase start
supabase db reset

# 2. configure the app
cp .env.example .env.local        # paste the anon key printed by `supabase start`

# 3. install deps and run
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

See **[docs/SELF_HOSTING.md](docs/SELF_HOSTING.md)** for the full guide,
including running the app in Docker and deploying the Supabase self-hosting
Compose stack on a server.

### Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and set:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321   # or your Supabase API URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only `NEXT_PUBLIC_*` values are needed by the app, and they are exposed to the
browser — never put the service-role key or DB password here.

## Database

The schema and seed data are defined in [`supabase/`](supabase/):

- `supabase/migrations/` — tables, RLS policies, grants, the auth trigger, and
  the `process_click` / `process_batch_clicks` RPCs.
- `supabase/seed.sql` — 164 countries (ordered by population), land areas, and
  the initial global stats row.

`supabase db reset` applies both. The historical, hand-applied files under
[`scripts/`](scripts/) are kept for reference only.

## Docker

`docker compose up -d --build` builds and runs the app on port 3000 (set
`NEXT_PUBLIC_*` in `.env` first). The Supabase backend runs separately — see the
self-hosting guide.

## Project structure

```
app/         Next.js App Router pages, API routes, and server actions
components/   Game components and the shadcn/ui component library
hooks/        Reusable React hooks
lib/          Supabase client and utilities
scripts/      SQL migrations and seed data
public/       Static assets
```
