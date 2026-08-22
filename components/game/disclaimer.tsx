import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Disclaimer() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl text-red-500">Important Disclaimer</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-400 text-sm">
        <p className="mb-2">
          "World Wipe" is a purely symbolic and abstract game designed for reflection and contemplation on global
          population dynamics.
        </p>
        <p className="mb-2">
          No real-world harm is intended or implied. The game's mechanics are a metaphorical representation and do not
          advocate for or condone any form of violence or harm towards any population or group.
        </p>
        <p>Please engage with the game responsibly and understand its conceptual nature.</p>
      </CardContent>
    </Card>
  )
}
