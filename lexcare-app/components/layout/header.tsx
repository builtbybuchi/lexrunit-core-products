"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/theme-context"
import { Moon, Sun, User, Settings, LogOut, PhoneCall, Bell, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { userProfileService, notificationsService } from "@/lib/appwrite-service"
import { useToast } from "@/components/ui/use-toast"

function RefreshButton() {
  const [rotating, setRotating] = useState(false)

  useEffect(() => {
    const handleLoad = () => setRotating(false)
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return (
    <Button
      variant="ghost"
      className="h-12 w-12 p-0 flex items-center justify-center"
      aria-label="Refresh"
      onClick={() => {
        setRotating(true)
        window.location.reload()
      }}
    >
      <RotateCcw className={`h-8 w-8 ${rotating ? 'animate-spin' : ''}`} />
    </Button>
  )
}

export function Header() {
  const { user, loading, signOut } = useAuth()
  //const { theme, toggleTheme } = useTheme()
  const [unreadCount, setUnreadCount] = useState(0)
  const [patient, setPatient] = useState<{ profile_image?: string; full_name?: string } | null>(null)
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true)
  const [showLoginButton, setShowLoginButton] = useState(false)

  useEffect(() => {
    if (!user && !loading) {
      const timeoutId = setTimeout(() => {
        setShowLoginButton(true)
      }, 5000)
      return () => clearTimeout(timeoutId)
    } else {
      setShowLoginButton(false)
    }
  }, [user, loading])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(navigator.onLine)
      console.log('Online status:', navigator.onLine)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0)
        return
      }
      try {
        const notifications = await notificationsService.getByUserId(user.id)
        const unread = notifications.filter((n: any) => !n.is_read)
        setUnreadCount(unread.length)
      } catch (err) {
        setUnreadCount(0)
      }
    }
    fetchUnreadCount()
  }, [user])

  useEffect(() => {
    const fetchPatient = async () => {
      if (!user) {
        setPatient(null)
        return
      }
      try {
        const profile = await userProfileService.getByUserId(user.id)
        setPatient(profile ? { profile_image: profile.profile_image, full_name: profile.full_name } : null)
      } catch (err) {
        setPatient(null)
      }
    }
    fetchPatient()
  }, [user])

  return (
    <div>
      {user ? (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
          <div className="container flex h-16 items-center px-4 sm:px-8">
            {/* <Sidebar /> */}
            {user ? (
              <Link href="/profile" className="flex items-center mr-4">
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient?.profile_image || ""} alt={patient?.full_name || "Profile"} />
                    <AvatarFallback>
                      {(() => {
                        if (!patient?.full_name || typeof patient.full_name !== 'string') return "?"
                        const names = patient.full_name.trim().split(" ").filter(Boolean)
                        if (names.length === 0) return "?"
                        if (names.length === 1) return names[0][0]?.toUpperCase() || "?"
                        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
                      })()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online/Offline Dot */}
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </Button>
              </Link>
            ) : null}
            <Link href="/" className="flex items-center">
              <span className="hidden md:inline-block text-xl font-bold text-primary">LexCare</span>
            </Link>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              {/* <RefreshButton /> */}
              {user && <>

                {/* Emergency Call Button */}
                <Link href="/emergency">
                  <Button variant="ghost" className="text-red-600 hover:bg-red-100 h-12 w-12 p-0 flex items-center justify-center" aria-label="Emergency Call">
                    <PhoneCall className="h-10 w-10" />
                  </Button>
                </Link>

                {/* Notifications Button */}
                <Link href="/notifications" aria-label="Notifications" className="relative">
                  <Button variant="ghost" className="h-12 w-12 p-0 flex items-center justify-center">
                    <Bell className="h-10 w-10" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full z-10 min-w-[1rem] min-h-[1rem]">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </>}
              {/* <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2" aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button> */}
              {showLoginButton && !user ? (
                <Button asChild variant="default" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </header>
      ) : null}
    </div>
  )
}
