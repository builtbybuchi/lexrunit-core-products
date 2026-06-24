"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push("/profile")
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel: Image & branding */}
      <div className="hidden lg:flex w-3/5 relative bg-black/70">
        <Image
          src="/research.jpg"
          alt="Hospital research"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />
        <div className="z-10 m-auto text-center text-white px-8">
          <h1 className="text-6xl font-extrabold mb-6 text-[#021488] drop-shadow-lg">LexCare</h1>
          <p className="text-2xl font-semibold text-[#0546B6]">Using AI to optimise healthcare</p>
        </div>
      </div>

      {/* Right panel: Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-[#C5ECF4]">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#021488]">Welcome Back</CardTitle>
            <CardDescription className="text-[#0546B6]">Sign in to continue</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-[#021488]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="bg-[#f0f9ff] focus-visible:ring-[#0A91F9]"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-[#021488]">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="bg-[#f0f9ff] focus-visible:ring-[#0A91F9]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#021488] hover:bg-[#0546B6] text-white font-semibold text-base"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Log in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
