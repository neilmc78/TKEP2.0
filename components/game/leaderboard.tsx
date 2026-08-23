import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaderboardEntry {
  user_id: string
  total_clicks: number
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[]
}

export function Leaderboard({ leaderboard }: LeaderboardProps) {
  return (
    <div className="p-4 bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-white mb-4">Top Wipers</h3>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-600">
            <TableHead className="text-gray-400">Rank</TableHead>
            <TableHead className="text-gray-400">User ID (Partial)</TableHead>
            <TableHead className="text-gray-400 text-right">Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-400">
                No players yet.
              </TableCell>
            </TableRow>
          )}
          {leaderboard.map((entry, index) => (
            <TableRow key={entry.user_id} className="border-gray-600 hover:bg-gray-600">
              <TableCell className="font-medium text-white">{index + 1}</TableCell>
              <TableCell className="text-gray-300">{entry.user_id.substring(0, 8)}...</TableCell>
              <TableCell className="text-right text-red-400">{entry.total_clicks.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
