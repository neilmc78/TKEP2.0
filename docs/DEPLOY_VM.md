# Deploying on a VM (Docker + Git) behind Tailscale Funnel

A concrete runbook for a small Linux VM (e.g. on Proxmox) that has **Docker** and
**Git**. Goal: get the app running with **working sign-up / login**, reachable
over the public internet through one Tailscale Funnel port.

The key idea: run everything as **single-origin**. The browser only ever talks
to the app's own URL; the app proxies Supabase's API internally. So you expose
exactly one port and there is no CORS to fight.

```
Public browser ──HTTPS──► Tailscale Funnel :443 ──► app :3000
                                                      │  (proxies /auth/v1, /rest/v1, ...)
                                                      ▼
                                            Supabase gateway (private on the VM)
```

---

## 0. Install the extra tools on the VM

```bash
# Git + Docker are assumed present. Add the Supabase CLI and Tailscale.

# Supabase CLI (Linux x86_64) — see https://github.com/supabase/cli/releases
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz \
  | sudo tar -xz -C /usr/local/bin supabase
supabase --version

# Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

> The Supabase CLI drives Docker for you — it is the fastest way to a working
> auth stack. See the note on secrets at the bottom before you rely on this
> publicly for real.

---

## 1. Pull the repo

```bash
git clone https://github.com/neilmc78/TKEP2.0.git
cd TKEP2.0
git checkout claude/extract-upload-repo-ia3hg9   # until this is merged to main
```

---

## 2. Start the backend and load the schema

```bash
supabase start        # boots Postgres + Auth + API in Docker (first run pulls images)
supabase db reset     # applies supabase/migrations + supabase/seed.sql
```

`supabase start` prints an **API URL** (`http://127.0.0.1:54321`) and an
**anon key** — copy the anon key for the next step.

---

## 3. Build and run the app (single-origin)

Create `.env` from the template and set the anon key you just copied:

```bash
cp .env.example .env
# In .env set:
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from `supabase start`>
#   NEXT_PUBLIC_SUPABASE_SAME_ORIGIN=true
```

Build the image, enabling the internal proxy to the local Supabase gateway:

```bash
set -a; . ./.env; set +a   # load the two NEXT_PUBLIC_* values into the shell

docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_SUPABASE_SAME_ORIGIN="true" \
  --build-arg SUPABASE_INTERNAL_URL="http://127.0.0.1:54321" \
  -t tkep2-web .
```

Run it on the host network so the proxy can reach Supabase on `127.0.0.1:54321`:

```bash
docker run -d --name tkep2-web --restart unless-stopped \
  --network host \
  tkep2-web
```

The app is now on **http://localhost:3000** (and on the VM's tailnet IP). Because
`SAME_ORIGIN=true`, the browser uses whatever host you load — localhost, the
tailnet IP, or the Funnel URL — with no rebuild needed.

> `NEXT_PUBLIC_SUPABASE_ANON_KEY` is baked into the client bundle at build time,
> so rebuild the image if you rotate the key.

---

## 4. Expose it with Tailscale Funnel

```bash
sudo tailscale funnel --bg 3000
sudo tailscale funnel status     # shows your public https://<machine>.<tailnet>.ts.net
```

Open that URL from a phone or another network and the sign-up / login page will
work end to end — the app proxies the auth calls to Supabase for you.

To stop exposing it: `sudo tailscale funnel --https=443 off`.

---

## 5. Verify login

1. Open the Funnel URL, go to **Sign up**, create an account with any email +
   password. Email confirmation is disabled by default
   (`supabase/config.toml` → `[auth.email] enable_confirmations = false`), so you
   are signed in immediately.
2. Any confirmation mail that is generated is caught locally by Inbucket at
   `http://127.0.0.1:54324` (nothing leaves the VM).
3. Watch the app logs with `docker logs -f tkep2-web` if anything misbehaves.

---

## Everyday operations

```bash
docker logs -f tkep2-web            # app logs
docker restart tkep2-web            # restart app
supabase stop                       # stop the backend (keeps data)
supabase start                      # bring it back

# update to the latest code:
git pull
supabase db reset                   # only if migrations/seed changed
docker build ... -t tkep2-web .     # (same build args as step 3)
docker rm -f tkep2-web && docker run -d --name tkep2-web --restart unless-stopped --network host tkep2-web
```

---

## Important: secrets before real public use

The Supabase **CLI stack ships with well-known demo JWT secrets**. It is perfect
for standing this up and iterating, but with those secrets anyone could forge
tokens against a publicly exposed instance. Before you treat this as a real
public deployment:

- Move the backend to the **official Supabase self-hosting Compose** with freshly
  generated `JWT_SECRET` / `ANON_KEY` / `SERVICE_ROLE_KEY` — see
  [SELF_HOSTING.md](SELF_HOSTING.md) **Path B**. The single-origin app setup
  above is unchanged; just point `SUPABASE_INTERNAL_URL` at that gateway
  (`http://127.0.0.1:8000`) and use the new anon key.
- Until then, consider keeping access limited (Tailscale **Serve** on your
  tailnet instead of public **Funnel**, or Funnel only while you're testing).
- For email confirmation / password reset links to work, set the Supabase
  `SITE_URL` (and additional redirect URLs) to your Funnel URL and configure SMTP.
