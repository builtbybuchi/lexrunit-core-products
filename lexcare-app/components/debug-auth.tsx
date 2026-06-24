"use client"

import { useAuth } from "@/contexts/auth-context"

export function DebugAuth() {
  const { user, loading } = useAuth()

  // Use a different approach to check if we're in development
  // This will work on the client side
  const isDevelopment =
    (typeof window !== "undefined" && window.location.hostname === "localhost") ||
    window.location.hostname === "127.0.0.1"

  if (!isDevelopment) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs z-50">
      <div>Loading: {loading ? "true" : "false"}</div>
      <div>User: {user ? user.email : "null"}</div>
      <div>User ID: {user ? user.id : "null"}</div>
    </div>
  )
}
