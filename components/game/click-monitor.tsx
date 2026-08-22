"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ClickStats {
  clickRate: number
  totalClicks: number
  pendingClicks: number
  maxRate: number
  isProcessing: boolean
}

export function useClickMonitor(isActive: boolean, onClickBatch: (count: number) => Promise<void>) {
  const [clickRate, setClickRate] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [pendingClicks, setPendingClicks] = useState(0)
  const [maxRate, setMaxRate] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  // Track clicks in the last second
  const clickTimestamps = useRef<number[]>([])
  const pendingClicksRef = useRef(0)
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Update click rate display every frame
  const updateClickRate = useCallback(() => {
    const now = Date.now()
    const oneSecondAgo = now - 1000

    // Remove clicks older than 1 second
    clickTimestamps.current = clickTimestamps.current.filter((timestamp) => timestamp > oneSecondAgo)

    const currentRate = clickTimestamps.current.length
    setClickRate(currentRate)
    setMaxRate((prev) => Math.max(prev, currentRate))

    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateClickRate)
    }
  }, [isActive])

  // Start/stop the rate monitor
  useEffect(() => {
    if (isActive) {
      animationFrameRef.current = requestAnimationFrame(updateClickRate)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isActive, updateClickRate])

  // Batch processing function
  const processBatch = useCallback(async () => {
    if (pendingClicksRef.current === 0 || isProcessing) return

    const clicksToProcess = pendingClicksRef.current
    pendingClicksRef.current = 0
    setPendingClicks(0)
    setIsProcessing(true)

    try {
      await onClickBatch(clicksToProcess)
      setTotalClicks((prev) => prev + clicksToProcess)
    } catch (error) {
      console.error("Batch processing failed:", error)
      // Re-add failed clicks back to pending
      pendingClicksRef.current += clicksToProcess
      setPendingClicks(pendingClicksRef.current)
    } finally {
      setIsProcessing(false)
    }
  }, [onClickBatch, isProcessing])

  // Register a click
  const registerClick = useCallback(() => {
    if (!isActive) return

    const now = Date.now()
    clickTimestamps.current.push(now)
    pendingClicksRef.current += 1
    setPendingClicks(pendingClicksRef.current)

    // Clear existing timeout and set a new one
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current)
    }

    // Process batch after 100ms of no clicks, or immediately if we have 50+ pending
    const delay = pendingClicksRef.current >= 50 ? 0 : 100
    batchTimeoutRef.current = setTimeout(processBatch, delay)
  }, [isActive, processBatch])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current)
      }
    }
  }, [])

  // Force process remaining clicks when component unmounts or becomes inactive
  useEffect(() => {
    if (!isActive && pendingClicksRef.current > 0) {
      processBatch()
    }
  }, [isActive, processBatch])

  return {
    registerClick,
    stats: {
      clickRate,
      totalClicks,
      pendingClicks,
      maxRate,
      isProcessing,
    },
  }
}

export function ClickRateDisplay({
  clickRate,
  maxRate,
  pendingClicks,
  isProcessing,
}: {
  clickRate: number
  maxRate: number
  pendingClicks: number
  isProcessing: boolean
}) {
  const ratePercentage = maxRate > 0 ? (clickRate / Math.max(maxRate, 20)) * 100 : 0

  return (
    <Card className="border-blue-500/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-blue-400">Click Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Current Rate</span>
            <span className="font-mono">{clickRate}/sec</span>
          </div>
          <Progress value={ratePercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-muted-foreground">Max Rate</div>
            <div className="font-mono font-semibold text-green-400">{maxRate}/sec</div>
          </div>
          <div>
            <div className="text-muted-foreground">Pending</div>
            <div className="font-mono font-semibold text-yellow-400">{pendingClicks}</div>
          </div>
        </div>

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent"></div>
            Processing batch...
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <div>💡 Tips for max speed:</div>
          <div>• Use spacebar or mouse</div>
          <div>• Clicks batch every 100ms</div>
          <div>• Target: 15-20 clicks/sec</div>
        </div>
      </CardContent>
    </Card>
  )
}
