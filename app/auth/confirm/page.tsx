"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export default function ConfirmPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token_hash = searchParams.get("token_hash")
      const type = searchParams.get("type")

      if (token_hash && type) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          })

          if (error) {
            setStatus("error")
            setMessage(error.message)
          } else {
            setStatus("success")
            setMessage("Email confirmed successfully! You can now sign in.")
          }
        } catch (error: any) {
          setStatus("error")
          setMessage("An unexpected error occurred.")
        }
      } else {
        setStatus("error")
        setMessage("Invalid confirmation link.")
      }
    }

    handleEmailConfirmation()
  }, [searchParams])

  const handleContinue = () => {
    if (status === "success") {
      router.push("/auth?message=Email confirmed! Please sign in.")
    } else {
      router.push("/auth")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Confirming your email...</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="text-green-600 font-semibold">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div>
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <p className="text-red-600">{message}</p>
            </div>
          )}

          {status !== "loading" && (
            <Button onClick={handleContinue} className="w-full">
              Continue to Sign In
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
