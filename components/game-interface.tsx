"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { UsernameSetup } from "@/components/username-setup"
import { WorldMap } from "@/components/world-map"
import { getGameData, clickCountry } from "@/app/actions"
import { Globe, User, MapPin, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Country {
  id: string
  name: string
  initial_population: number
  current_population: number
  is_cleared: boolean
  order_index: number
  area_km2?: number
}

interface UserProgress {
  total_clicks: number
  last_country_id: string | null
}

interface GlobalStats {
  total_world_clicks: number
  total_world_population: number
  countries_cleared: number
}

interface Profile {
  username: string
  display_name: string
}

interface LeaderboardEntry {
  user_id: string
  total_clicks: number
  username?: string
  display_name?: string
}

interface GameInterfaceProps {
  user: any
  onSignOut: () => void
}

// Helper function to format area with appropriate units
function formatArea(areaKm2: number): string {
  if (areaKm2 < 1) {
    return `${(areaKm2 * 1000000).toLocaleString()} m²`
  } else if (areaKm2 < 1000) {
    return `${areaKm2.toLocaleString()} km²`
  } else {
    return `${areaKm2.toLocaleString()} km²`
  }
}

// Helper function to calculate population density
function calculateDensity(population: number, areaKm2: number): string {
  if (areaKm2 === 0) return "N/A"
  const density = population / areaKm2
  return `${Math.round(density).toLocaleString()} people/km²`
}

export function GameInterface({ user, onSignOut }: GameInterfaceProps) {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [clearedCountries, setClearedCountries] = useState<Country[]>([])
  const [allCountries, setAllCountries] = useState<Country[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsProfile, setNeedsProfile] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [mapDialogOpen, setMapDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState({ username: "", display_name: "" })
  const [profileLoading, setProfileLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nextPlayerClicks, setNextPlayerClicks] = useState<number | null>(null)
  const [userRank, setUserRank] = useState<number | null>(null)

  const fetchGameData = async () => {
    try {
      const data = await getGameData(user.id)

      if (data.error) {
        toast.error(data.error)
        return
      }

      if (data.needsProfile) {
        setNeedsProfile(true)
        setLoading(false)
        return
      }

      setProfile(data.profile)
      setEditingProfile({
        username: data.profile.username,
        display_name: data.profile.display_name,
      })
      setUserProgress(data.userProgress)
      setCurrentCountry(data.currentCountry)
      setClearedCountries(data.clearedCountries)
      setAllCountries(data.allCountries)
      setGlobalStats(data.globalStats)
      setLeaderboard(data.leaderboard)
    } catch (error) {
      console.error("Error fetching game data:", error)
      toast.error("Failed to load game data")
    } finally {
      setLoading(false)
    }
  }

  const handleProfileComplete = () => {
    setNeedsProfile(false)
    fetchGameData()
  }

  const handleWipeClick = async () => {
    if (!currentCountry) return

    startTransition(async () => {
      const result = await clickCountry(currentCountry.id, user.id)
      if (result.success) {
        if (result.country_cleared) {
          toast.success(`Country ${currentCountry.name} has been wiped! Moving to the next target.`)
        }
        // Refresh data after click
        await fetchGameData()
      } else {
        toast.error(result.message || "Failed to wipe population.")
      }
    })
  }

  const handleProfileUpdate = async () => {
    if (!editingProfile.username.trim()) {
      toast.error("Username is required")
      return
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(editingProfile.username)) {
      toast.error("Username must be 3-20 characters and contain only letters, numbers, and underscores")
      return
    }

    setProfileLoading(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: editingProfile.username.toLowerCase(),
          display_name: editingProfile.display_name.trim() || editingProfile.username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        if (error.code === "23505") {
          toast.error("Username already taken. Please choose another.")
        } else {
          throw error
        }
      } else {
        toast.success("Profile updated successfully!")
        setProfileDialogOpen(false)
        await fetchGameData()
      }
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast.error("Failed to update profile")
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    fetchGameData()
  }, [user.id])

  useEffect(() => {
    const calculateNextPlayer = async () => {
      if (!userProgress) return

      try {
        // Get the player immediately above the current user
        const { data: nextPlayer } = await supabase
          .from("user_progress")
          .select("total_clicks")
          .gt("total_clicks", userProgress.total_clicks)
          .order("total_clicks", { ascending: true })
          .limit(1)
          .single()

        // Get current user's rank
        const { count: rank } = await supabase
          .from("user_progress")
          .select("*", { count: "exact", head: true })
          .gt("total_clicks", userProgress.total_clicks)

        setNextPlayerClicks(nextPlayer?.total_clicks || null)
        setUserRank((rank || 0) + 1)
      } catch (error) {
        console.error("Error calculating next player:", error)
      }
    }

    calculateNextPlayer()
  }, [userProgress])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (needsProfile) {
    return <UsernameSetup user={user} onComplete={handleProfileComplete} />
  }

  const worldProgress = globalStats ? (globalStats.total_world_clicks / globalStats.total_world_population) * 100 : 0

  const countryProgress = currentCountry
    ? ((currentCountry.initial_population - currentCountry.current_population) / currentCountry.initial_population) *
      100
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-primary">TKEPv2 - The Kill Everyone Project Revisited</h1>
            {profile && <p className="text-sm text-muted-foreground">Welcome back, {profile.display_name}!</p>}
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  World Map
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>World Wipe Progress Map</DialogTitle>
                </DialogHeader>
                <WorldMap currentCountry={currentCountry} clearedCountries={clearedCountries} />
              </DialogContent>
            </Dialog>
            <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-username">Username</Label>
                    <Input
                      id="edit-username"
                      value={editingProfile.username}
                      onChange={(e) => setEditingProfile((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="worldwiper123"
                      minLength={3}
                      maxLength={20}
                      pattern="[a-zA-Z0-9_]+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-display-name">Display Name</Label>
                    <Input
                      id="edit-display-name"
                      value={editingProfile.display_name}
                      onChange={(e) => setEditingProfile((prev) => ({ ...prev, display_name: e.target.value }))}
                      placeholder="The World Wiper"
                      maxLength={50}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleProfileUpdate} disabled={profileLoading} className="flex-1">
                      {profileLoading ? "Updating..." : "Update Profile"}
                    </Button>
                    <Button variant="outline" onClick={() => setProfileDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={onSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Target */}
          <Card>
            <CardHeader>
              <CardTitle>Current Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCountry ? (
                <>
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-primary mb-2">{currentCountry.name}</h2>
                    <p className="text-2xl text-muted-foreground">
                      Population: {currentCountry.current_population.toLocaleString()}
                    </p>
                  </div>

                  {/* Enhanced Country Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Original Population</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        {currentCountry.initial_population.toLocaleString()}
                      </p>
                    </div>

                    {currentCountry.area_km2 && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Land Area</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">{formatArea(currentCountry.area_km2)}</p>
                      </div>
                    )}

                    {currentCountry.area_km2 && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Population Density</span>
                        </div>
                        <p className="text-lg font-bold text-orange-600">
                          {calculateDensity(currentCountry.initial_population, currentCountry.area_km2)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{countryProgress.toFixed(1)}%</span>
                    </div>
                    <Progress value={countryProgress} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Wiped:{" "}
                        {(currentCountry.initial_population - currentCountry.current_population).toLocaleString()}
                      </span>
                      <span>Remaining: {currentCountry.current_population.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleWipeClick}
                    disabled={isPending || currentCountry.current_population <= 0}
                    className="w-full h-16 text-xl font-bold"
                    size="lg"
                  >
                    {currentCountry.current_population <= 0 ? "CLEARED" : isPending ? "WIPING..." : "WIPE ONE"}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-green-500">🎉 All Countries Wiped! 🎉</h2>
                  <p className="text-muted-foreground mt-2">You've completed the world wipe!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Global Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Global Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {globalStats && (
                <>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {globalStats.total_world_clicks.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Population</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-500">
                        {(globalStats.total_world_population - globalStats.total_world_clicks).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>World Progress</span>
                      <span>{worldProgress.toFixed(3)}%</span>
                    </div>
                    <Progress value={worldProgress} className="h-3" />
                  </div>

                  {/* Country Progress Stats */}
                  <div className="grid grid-cols-1 gap-3 pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Country:</span>
                      <span className="font-semibold text-blue-500">
                        {(() => {
                          if (!currentCountry) return "All Complete! 🎉"

                          // Find the country that comes AFTER the current one
                          const nextCountry = allCountries.find((c) => c.order_index === currentCountry.order_index + 1)

                          return nextCountry ? nextCountry.name : "Final Country!"
                        })()}
                      </span>
                    </div>

                    {(() => {
                      const lastCleared =
                        clearedCountries.length > 0
                          ? clearedCountries.reduce((latest, country) =>
                              country.order_index > latest.order_index ? country : latest,
                            )
                          : null

                      return (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Last Completed:</span>
                          <span className="font-semibold text-green-500">
                            {lastCleared ? lastCleared.name : "None yet"}
                          </span>
                        </div>
                      )
                    })()}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Countries Cleared:</span>
                      <span className="font-semibold text-purple-500">{globalStats.countries_cleared || 0} / 164</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-500/50">
            <CardHeader>
              <CardTitle className="text-yellow-500">⚠️ Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                "World Wipe" is a purely symbolic and abstract game designed for reflection and contemplation on global
                population dynamics.
              </p>
              <p>
                No real-world harm is intended or implied. The game's mechanics are a metaphorical representation and do
                not advocate for or condone any form of violence or harm towards any population or group.
              </p>
              <p className="font-semibold">
                Please engage with the game responsibly and understand its conceptual nature.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProgress && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Population:</span>
                    <span className="font-bold text-primary">{userProgress.total_clicks.toLocaleString()}</span>
                  </div>

                  {/* Add Clicks to Next Place calculation - works for ANY rank */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Your Rank:</span>
                      <span className="font-bold text-blue-500">
                        {userRank ? `#${userRank.toLocaleString()}` : "Calculating..."}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clicks to Next Position:</span>
                      <span className="font-bold text-orange-500">
                        {!nextPlayerClicks ? "🥇 #1!" : nextPlayerClicks - userProgress.total_clicks}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-muted-foreground">No players yet</p>
                ) : (
                  leaderboard.map((player, index) => (
                    <div
                      key={player.user_id}
                      className={`flex justify-between items-center p-2 rounded ${
                        player.user_id === user.id ? "bg-primary/20 border border-primary/50" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">#{index + 1}</span>
                        <div>
                          <div className="font-semibold">{player.display_name}</div>
                          <div className="text-xs text-muted-foreground">@{player.username}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-bold">{player.total_clicks.toLocaleString()}</div>
                        <div className="text-muted-foreground">clicks</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
