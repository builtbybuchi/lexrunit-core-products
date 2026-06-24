"use client";
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { usePathname } from "next/navigation"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} font-montserrat`}>
        {/*<ThemeProvider>*/}
          <AuthProvider>
            <div className="">
              {pathname !== "/chat" && pathname !== "/consultation" && <Header />}
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              
              <Toaster />
            </div>
            <BottomNav />
          </AuthProvider>
        {/*</ThemeProvider>*/}
      </body>
    </html>
  )
}
