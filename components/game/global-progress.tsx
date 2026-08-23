import { Progress } from "@/components/ui/progress"

interface GlobalProgressProps {
  totalWorldClicks: number
  totalWorldPopulation: number
  worldProgressPercentage: number
}

export function GlobalProgress({
  totalWorldClicks,
  totalWorldPopulation,
  worldProgressPercentage,
}: GlobalProgressProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-white">World Progress</h3>
      <p className="text-gray-300">
        Total Clicks: <span className="font-semibold text-red-400">{totalWorldClicks.toLocaleString()}</span>
      </p>
      <p className="text-gray-300">
        Remaining Population:{" "}
        <span className="font-semibold text-green-400">
          {(totalWorldPopulation - totalWorldClicks).toLocaleString()}
        </span>
      </p>
      <div className="w-full">
        <Progress
          value={worldProgressPercentage}
          className="w-full h-3 bg-gray-600 [&::-webkit-progress-bar]:bg-gray-600 [&::-webkit-progress-value]:bg-red-500"
        />
        <p className="text-sm text-gray-400 mt-1 text-center">{worldProgressPercentage.toFixed(2)}% of World Wiped</p>
      </div>
    </div>
  )
}
