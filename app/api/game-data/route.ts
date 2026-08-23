import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(_req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ needsAuth: true }, { status: 401 })
  }

  const userId = user.id

  // ---- profile ---------------------------------------------------
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (!profile) {
    return NextResponse.json({ needsProfile: true })
  }

  // ---- user progress ---------------------------------------------
  const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", userId).single()

  // ---- countries -------------------------------------------------
  const { data: allCountries } = await supabase.from("countries").select("*").order("order_index", { ascending: true })

  if (!allCountries) {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }

  const clearedCountries = allCountries.filter((c) => c.is_cleared)

  let currentCountry = null
  if (progress?.last_country_id) {
    const last = allCountries.find((c) => c.id === progress.last_country_id)
    currentCountry = last && !last.is_cleared ? last : allCountries.find((c) => !c.is_cleared) || null
  } else {
    currentCountry = allCountries.find((c) => !c.is_cleared) || null
  }

  // ---- global stats ----------------------------------------------
  const { data: globalStats } = await supabase.from("global_stats").select("*").eq("id", 1).single()

  // ---- leaderboard -----------------------------------------------
  const { data: leaders } = await supabase
    .from("user_progress")
    .select("user_id, total_clicks")
    .order("total_clicks", { ascending: false })
    .limit(10)

  let leaderboard = []
  if (leaders?.length) {
    const ids = leaders.map((l) => l.user_id)
    const { data: profiles } = await supabase.from("profiles").select("id, username, display_name").in("id", ids)

    leaderboard = leaders.map((row) => {
      const p = profiles?.find((pr) => pr.id === row.user_id)
      return {
        ...row,
        username: p?.username ?? `user_${row.user_id.slice(0, 8)}`,
        display_name: p?.display_name ?? "Anonymous Player",
      }
    })
  }

  return NextResponse.json({
    userProgress: progress ?? { total_clicks: 0, last_country_id: null },
    currentCountry,
    globalStats,
    leaderboard,
    profile,
  })
}
