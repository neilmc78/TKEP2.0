"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface UsernameSetupProps {
  user: any
  onComplete: () => void
}

export function UsernameSetup({ user, onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      toast.error("Username is required")
      return
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      toast.error("Username must be 3-20 characters and contain only letters, numbers, and underscores")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        username: username.toLowerCase(),
        display_name: displayName.trim() || username,
      })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast.error("Username already taken. Please choose another.")
        } else {
          throw error
        }
      } else {
        toast.success("Profile created successfully!")
        onComplete()
      }
    } catch (error: any) {
      console.error("Profile creation error:", error)
      toast.error("Failed to create profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Choose Your Identity</CardTitle>
          <CardDescription>Set up your username to appear on the leaderboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="worldwiper123"
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
              />
              <p className="text-xs text-muted-foreground mt-1">
                3-20 characters, letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <Label htmlFor="displayName">Display Name (optional)</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="The World Wiper"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How you'll appear on the leaderboard (defaults to username)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Profile..." : "Start Wiping"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
