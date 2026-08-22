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

```bash
# install dependencies (project uses pnpm)
pnpm install

# run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

### Environment variables

Create a `.env.local` with your Supabase project credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database

SQL migrations and seed data live in [`scripts/`](scripts/). Run them against your
Supabase/Postgres instance in numeric order to create the tables, seed country
data, and install the click-tracking functions.

## Project structure

```
app/         Next.js App Router pages, API routes, and server actions
components/   Game components and the shadcn/ui component library
hooks/        Reusable React hooks
lib/          Supabase client and utilities
scripts/      SQL migrations and seed data
public/       Static assets
```
