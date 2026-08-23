"use client"

/**
 * Client-side helpers used by React components.
 * They call Supabase directly from the browser with the logged-in user's JWT,
 * so no Service-Role key is needed (and RLS policies remain enforced).
 */

import { createClientComponentClient } from "@/lib/supabase"
import { toast } from "sonner"

const supabase = createClientComponentClient()

/* ------------------------------------------------------------------ */
/*  Fetch all data required to render the game                         */
/* ------------------------------------------------------------------ */
export async function getGameData(userId: string) {
  try {
    // profile --------------------------------------------------------
    const { data: profile, error: profileErr } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (profileErr) throw profileErr
    if (!profile) return { needsProfile: true }

    // progress -------------------------------------------------------
    const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", userId).single()

    // countries ------------------------------------------------------
    const { data: countries, error: cErr } = await supabase
      .from("countries")
      .select("*")
      .order("order_index", { ascending: true })
    if (cErr) throw cErr

    const cleared = countries.filter((c) => c.is_cleared)
    let currentCountry = null
    if (progress?.last_country_id) {
      const last = countries.find((c) => c.id === progress.last_country_id)
      currentCountry = last && !last.is_cleared ? last : countries.find((c) => !c.is_cleared) || null
    } else {
      currentCountry = countries.find((c) => !c.is_cleared) || null
    }

    // global stats ---------------------------------------------------
    const { data: globalStats } = await supabase.from("global_stats").select("*").eq("id", 1).single()

    // leaderboard ----------------------------------------------------
    const { data: leaders } = await supabase
      .from("user_progress")
      .select("user_id,total_clicks")
      .order("total_clicks", { ascending: false })
      .limit(10)

    let leaderboard: any[] = []
    if (leaders?.length) {
      const ids = leaders.map((l) => l.user_id)
      const { data: profiles } = await supabase.from("profiles").select("id,username,display_name").in("id", ids)

      leaderboard = leaders.map((row) => {
        const p = profiles?.find((pr) => pr.id === row.user_id)
        return {
          ...row,
          username: p?.username ?? `user_${row.user_id.slice(0, 8)}`,
          display_name: p?.display_name ?? "Anonymous Player",
        }
      })
    }

    return {
      userProgress: progress ?? { total_clicks: 0, last_country_id: null },
      currentCountry,
      globalStats,
      leaderboard,
      clearedCountries: cleared,
      allCountries: countries, // Add this to access all countries
      profile,
    }
  } catch (err: any) {
    console.error("getGameData error:", err)
    toast.error("Failed to load game data")
    return { error: err.message }
  }
}

/* ------------------------------------------------------------------ */
/*  Process a single "WIPE ONE" click                                  */
/* ------------------------------------------------------------------ */
export async function clickCountry(countryId: string, userId: string) {
  try {
    const { data, error } = await supabase.rpc("process_click", {
      p_user_id: userId,
      p_country_id: countryId,
    })
    if (error) throw error
    return data
  } catch (err: any) {
    console.error("clickCountry error:", err)
    toast.error(err.message ?? "Failed to wipe")
    return { success: false }
  }
}
