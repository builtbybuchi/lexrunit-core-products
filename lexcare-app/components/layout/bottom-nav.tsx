"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Activity, User, MessageSquare, Bell, Calendar, Heart } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function BottomNav() {
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  const routes = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    { name: "Health", path: "/health-tracker", icon: <Activity className="h-5 w-5" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Consult", path: "/consultation", icon: <Heart className="h-5 w-5" /> },
    { name: "Appointments", path: "/appointments", icon: <Calendar className="h-5 w-5" /> },
  ]

  return (
    <div>
      {user ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {routes.map((route) => (
          <Link
            key={route.path}
            href={route.path}
            className={`flex flex-col items-center justify-center w-full h-full ${
              pathname === route.path ? "text-primary" : "text-gray-500 hover:text-primary"
            }`}
          >
            {route.icon}
            <span className="text-xs mt-1">{route.name}</span>
          </Link>
        ))}
      </div>
    </div>
      ) : null}
    </div>
  )
}
