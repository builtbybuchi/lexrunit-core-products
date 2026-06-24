"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { Menu, MessageSquare, Calendar, Bell, Star, Settings, PhoneCall, LogOut, X } from "lucide-react"

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const routes = [
    { name: "Consultations", path: "/consultation", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Appointments", path: "/appointments", icon: <Calendar className="h-5 w-5" /> },
    { name: "Notifications", path: "/notifications", icon: <Bell className="h-5 w-5" /> },
    { name: "Rate this app", path: "/feedback", icon: <Star className="h-5 w-5" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
    { name: "Emergency", path: "/emergency", icon: <PhoneCall className="h-5 w-5 text-red-500" /> },
  ]

  const handleSignOut = async () => {
    await signOut()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="text-2xl font-bold text-primary">LexCare</span>
            </Link>
            {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button> */}
          </div>
          <nav className="space-y-2 flex-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  pathname === route.path ? "bg-primary text-white" : "hover:bg-accent hover:text-primary"
                }`}
              >
                {route.icon}
                <span>{route.name}</span>
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="flex items-center gap-3 mt-auto mb-4 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
