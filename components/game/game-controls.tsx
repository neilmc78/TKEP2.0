"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { clickCountry } from "@/app/actions"
import { toast } from "sonner"

interface Country {
  id: string
  name: string
  initial_population: number
  current_population: number
  is_cleared: boolean
}

interface GameControlsProps {
  country: Country
  userTotalClicks: number
  userId: string
}

export function GameControls({ country, userTotalClicks, userId }: GameControlsProps) {
  const [isPending, startTransition] = useTransition()
  const populationRemoved = country.initial_population - country.current_population
  const progressPercentage = (populationRemoved / country.initial_population) * 100

  const handleWipeClick = async () => {
    startTransition(async () => {
      const result = await clickCountry(country.id)
      if (result.success) {
        if (result.clearedCountry) {
          toast.success(`Country ${country.name} has been wiped! Moving to the next target.`)
        } else {
          // Optional: Add subtle visual/audio feedback here for each click
          // console.log("Click registered for", country.name);
        }
      } else {
        toast.error(result.message || "Failed to wipe population.")
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-700 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-white">{country.name}</h2>
      <p className="text-gray-300">
        Current Population:{" "}
        <span className="font-semibold text-red-400">{country.current_population.toLocaleString()}</span>
      </p>
      <p className="text-gray-300">
        Removed: <span className="font-semibold text-green-400">{populationRemoved.toLocaleString()}</span>
      </p>
      <div className="w-full">
        <Progress
          value={progressPercentage}
          className="w-full h-3 bg-gray-600 [&::-webkit-progress-bar]:bg-gray-600 [&::-webkit-progress-value]:bg-red-500"
        />
        <p className="text-sm text-gray-400 mt-1 text-center">{progressPercentage.toFixed(2)}% Wiped</p>
      </div>
      <Button
        onClick={handleWipeClick}
        disabled={isPending || country.current_population <= 0}
        className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 animate-pulse-once"
      >
        {country.current_population <= 0 ? "CLEARED" : isPending ? "WIPING..." : "WIPE ONE"}
      </Button>
      <p className="text-sm text-gray-400 mt-2">Your Total Clicks: {userTotalClicks.toLocaleString()}</p>
    </div>
  )
}
