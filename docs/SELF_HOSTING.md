# Self-hosting TKEP2.0 (World Wipe)

This guide gets the game running entirely on your own infrastructure — no v0 and
no Supabase cloud. There are two supported backends, both Docker-based:

- **Path A — Supabase CLI (`supabase start`).** Recommended for getting up and
  running now / for local development. One command boots the full Supabase stack
  (Postgres, Auth, PostgREST, Studio, mail catcher) in Docker and applies this
  repo's migrations and seed automatically.
- **Path B — Supabase self-hosting Docker Compose.** For a real server. Uses
  Supabase's official Compose stack; you drop this repo's SQL in and point the
  app at it.

The app itself is a standard Next.js 15 app and can run with `pnpm dev`, `pnpm
start`, or the provided `Dockerfile` / `docker-compose.yml`.

---

## Architecture

```
Browser ──► Next.js app (this repo)
                 │  (supabase-js, using NEXT_PUBLIC_SUPABASE_URL + ANON_KEY)
                 ▼
        Supabase API gateway ──► Postgres  (tables + RLS + RPCs)
                              └─► GoTrue    (email auth)
```

- All game state lives in Postgres: `countries`, `global_stats`,
  `user_progress`, `profiles`.
- Population is only ever decremented through the `process_click` /
  `process_batch_clicks` Postgres functions (SECURITY DEFINER), never by direct
  table writes.
- Supabase is called **from the browser**, so `NEXT_PUBLIC_SUPABASE_URL` must be
  reachable from the user's browser (not just from inside a container).

The database schema and seed are defined once, in:

- `supabase/migrations/20240101000000_init.sql` — tables, RLS policies, grants,
  auth trigger, and the click RPCs.
- `supabase/seed.sql` — 164 countries (ordered by population), land areas, and
  the initial `global_stats` row.

> The historical, hand-applied files under `/scripts` are kept for reference
> only. `supabase/` is the source of truth.

---

## Prerequisites

- **Node.js 20+** and **pnpm** (`corepack enable` gives you pnpm).
- **Docker** + the Docker Compose plugin.
- For Path A: the **Supabase CLI** — https://supabase.com/docs/guides/local-development/cli/getting-started

---

## Path A — Supabase CLI (recommended to start)

1. **Install the Supabase CLI** (see link above), then from the repo root:

   ```bash
   supabase start
   ```

   This pulls the Supabase images (first run only) and boots the stack in
   Docker. When it finishes it prints your local credentials, e.g.:

   ```
   API URL: http://127.0.0.1:54321
   anon key: eyJhbGciOiJIUzI1NiIs...
   Studio URL: http://127.0.0.1:54323
   Inbucket URL: http://127.0.0.1:54324
   ```

2. **Apply the schema + seed** (also re-runnable any time to reset state):

   ```bash
   supabase db reset
   ```

   `db reset` runs `supabase/migrations/*` then `supabase/seed.sql`.

3. **Point the app at it.** Copy the env template and fill in the printed anon
   key (the URL default already matches the CLI):

   ```bash
   cp .env.example .env.local
   # NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key printed by `supabase start`>
   ```

   The anon key in `.env.example` is the well-known local demo key and usually
   matches the CLI's default, but paste the printed one to be safe.

4. **Run the app:**

   ```bash
   pnpm install
   pnpm dev            # http://localhost:3000
   ```

5. **Sign up.** Email confirmations are disabled in `supabase/config.toml`
   (`[auth.email] enable_confirmations = false`) so you can sign in immediately.
   Any confirmation mail that is sent is caught by Inbucket at
   http://127.0.0.1:54324 — nothing leaves your machine.

To stop the stack: `supabase stop` (add `--no-backup` to also drop data).

---

## Path B — Supabase self-hosting Docker Compose (server)

Use Supabase's officially maintained Compose stack, then load this repo's SQL.

1. **Get the stack.** Follow
   https://supabase.com/docs/guides/self-hosting/docker — in short:

   ```bash
   git clone --depth 1 https://github.com/supabase/supabase
   cd supabase/docker
   cp .env.example .env
   ```

2. **Generate real secrets** and put them in that `.env` — do **not** ship the
   demo values. You need at minimum: `POSTGRES_PASSWORD`, `JWT_SECRET`, and a
   matching `ANON_KEY` / `SERVICE_ROLE_KEY`. Supabase provides a generator:
   https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys

3. **Start it:**

   ```bash
   docker compose up -d
   ```

   The API gateway is exposed on port `8000` by default; Studio on `3000`
   (change Studio's port if you want to run this app on 3000 too).

4. **Load this repo's schema + seed** into the stack's Postgres. From this
   repo's root, with the DB reachable (adjust host/port/password to your `.env`):

   ```bash
   PGURL="postgresql://postgres:<POSTGRES_PASSWORD>@localhost:5432/postgres"
   psql "$PGURL" -f supabase/migrations/20240101000000_init.sql
   psql "$PGURL" -f supabase/seed.sql
   ```

   (Or copy those two files into `supabase/docker/volumes/db/` and reference them
   so they run on first boot — see the Supabase docs on custom init SQL.)

5. **Point the app at it.** In this repo:

   ```bash
   cp .env.example .env
   # NEXT_PUBLIC_SUPABASE_URL=http://<server-host>:8000   (or your https URL)
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY from the supabase/docker .env>
   ```

6. **Run the app** (Docker):

   ```bash
   docker compose up -d --build     # builds ./Dockerfile, serves on :3000
   ```

   `NEXT_PUBLIC_*` are read from `.env` and baked into the client bundle at build
   time, so rebuild the image whenever those change.

For a public deployment, also:

- Set `[auth.email] enable_confirmations = true` (config.toml) / configure real
  SMTP in the Supabase stack so confirmation mail actually sends.
- Put the app and API behind TLS (a reverse proxy such as Caddy or nginx) and
  use `https://` URLs.

---

## Running the app with Docker (either backend)

```bash
cp .env.example .env         # set NEXT_PUBLIC_SUPABASE_URL + ANON_KEY
docker compose up -d --build # http://localhost:3000
```

Remember `NEXT_PUBLIC_SUPABASE_URL` must be what the **browser** can reach. For
a local Supabase CLI stack that is `http://127.0.0.1:54321`; in production it is
your public API URL.

---

## Resetting / reseeding game state

- **CLI:** `supabase db reset` (drops, re-migrates, re-seeds).
- **Any Postgres:** re-run `supabase/seed.sql` — it is idempotent (upserts
  countries/areas and recomputes `global_stats.total_world_population`). To also
  wipe player progress and clicks:

  ```sql
  UPDATE countries SET current_population = initial_population, is_cleared = FALSE;
  UPDATE global_stats SET total_world_clicks = 0, countries_cleared = 0 WHERE id = 1;
  TRUNCATE user_progress;
  ```

---

## Notes & known limitations

- **Map data is vendored** at `public/countries-110m.json` (from the
  `world-atlas` package), so the map has no runtime CDN dependency. The
  country-matching in `components/world-map.tsx` matches on the dataset's
  `properties.name`.
- **Google Fonts at build time:** `app/layout.tsx` uses `next/font/google`
  (Inter), which is fetched during `next build`. Build machines therefore need
  outbound access to Google Fonts. To build fully offline, self-host the font or
  switch to a system font stack.
- **This is the self-hosting foundation only.** The rapid-fire clicker rework
  (KPM, batched clicks via `process_batch_clicks`, session stats) and the
  dark-red TKEP aesthetic are planned follow-ups.
