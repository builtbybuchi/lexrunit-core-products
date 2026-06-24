"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sidebar } from "./sidebar"
import { getCurrentUser, type User } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
  hospitalDetails?: { hospital_name: string; city: string; state: string }
}

// Utility to load offline profile details
const STORAGE_KEY = 'doctorProfileDetails';
function loadProfileDetailsOffline() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.profile) {
          console.log('[MainLayout Offline] Loaded user from localStorage:', parsed.profile);
          return parsed.profile;
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return null;
}

export function MainLayout({ children, hospitalDetails }: MainLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
        } else {
          // Try offline fallback
          const offlineProfile = loadProfileDetailsOffline();
          if (offlineProfile) {
            setUser(offlineProfile);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // Try offline fallback
        const offlineProfile = loadProfileDetailsOffline();
        if (offlineProfile) {
          setUser(offlineProfile);
        } else {
          setUser(null);
        }
      }
      setLoading(false)
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#021488]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#021488] mb-4">LexCare HMS</h1>
          <p className="text-gray-600">Please configure Supabase to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-20">
        <Sidebar userRole={user.role} />
      </div>
      {/* Sidebar drawer for mobile */}
      <div className={`lg:hidden fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className={`absolute left-0 top-0 h-full w-64 bg-[#021488] text-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <Sidebar userRole={user.role} />
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile menu button */}
        {!sidebarOpen && (
          <button
            className="lg:hidden p-3 m-2 rounded-md bg-[#021488] text-white w-10 h-10 flex items-center justify-center z-40"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        )}
        <main className="flex-1 p-2 sm:p-4 md:p-6 min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="w-full lg:fixed lg:bottom-0 lg:right-0 lg:w-[calc(100%-16rem)] bg-[#C5ECF4] dark:bg-[#021488] p-2 sm:p-4 text-center">
          <p className="text-[#021488] dark:text-[#C5ECF4] text-xs sm:text-sm">
            {hospitalDetails
              ? `${hospitalDetails.hospital_name}, ${hospitalDetails.city}, ${hospitalDetails.state}`
              : '•'}
            {" "}
            <span className="text-[#0A91F9] font-semibold">LexCare</span>
          </p>
        </footer>
      </div>
    </div>
  )
}
