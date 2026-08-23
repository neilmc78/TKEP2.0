import { createClient } from "@supabase/supabase-js"

/**
 * Resolving the Supabase URL.
 *
 * Two modes:
 *  - Default: the browser talks to NEXT_PUBLIC_SUPABASE_URL directly (Supabase
 *    cloud, or a local/self-hosted gateway).
 *  - Same-origin (NEXT_PUBLIC_SUPABASE_SAME_ORIGIN="true"): the browser talks to
 *    the page's own origin, and the Next.js server proxies /auth/v1, /rest/v1,
 *    etc. to the real Supabase (see SUPABASE_INTERNAL_URL in next.config.mjs).
 *    This means one public origin — ideal behind a single Tailscale Funnel port
 *    — and it works at any hostname without rebuilding.
 *
 * On the server (SSR) window is undefined, so we fall back to the configured
 * URL. That client is only constructed, never used for auth requests during
 * SSR (all auth happens in the browser), but createClient still needs a value.
 */
const CONFIGURED_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321"
const SAME_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_SAME_ORIGIN === "true"

function resolveSupabaseUrl() {
  if (SAME_ORIGIN && typeof window !== "undefined") {
    return window.location.origin
  }
  return CONFIGURED_URL
}

const supabaseUrl = resolveSupabaseUrl()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey

// Create a singleton client for components
let clientInstance: ReturnType<typeof createClient> | null = null

export function createClientComponentClient() {
  if (!clientInstance) {
    clientInstance = createClient(resolveSupabaseUrl(), supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  }
  return clientInstance
}
