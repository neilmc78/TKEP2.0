// When SUPABASE_INTERNAL_URL is set (evaluated at build time), the app proxies
// Supabase's API paths to that upstream. This lets the browser talk only to the
// app's own origin — set NEXT_PUBLIC_SUPABASE_URL to the public app URL and the
// app forwards /auth/v1, /rest/v1, etc. to Supabase internally. That means a
// single public origin (one Tailscale Funnel port) and no CORS. Leave it unset
// to have the browser call Supabase directly.
const supabaseInternalUrl = process.env.SUPABASE_INTERNAL_URL?.replace(/\/$/, "")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // image can run without the full node_modules tree.
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!supabaseInternalUrl) return []
    // Supabase JS clients address the gateway by these fixed path prefixes.
    // Note the app's own /auth/callback and /auth/confirm pages are NOT under
    // /auth/v1, so they are unaffected.
    return ["auth", "rest", "realtime", "storage", "functions"].map((svc) => ({
      source: `/${svc}/v1/:path*`,
      destination: `${supabaseInternalUrl}/${svc}/v1/:path*`,
    }))
  },
}

export default nextConfig
