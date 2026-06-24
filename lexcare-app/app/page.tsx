"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Calendar, Activity, FileText } from "lucide-react"
import { DebugAuth } from "@/components/debug-auth"
import signupPage from "../public/signupPage.jpg"
import welcomePage from "../public/welcomePage.jpg"

export default function Home() {
  const { user, loading } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [healthTip, setHealthTip] = useState("")
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false)

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    // Random health tips
    const tips = [
      "Drink at least 8 glasses of water daily for optimal hydration.",
      "Aim for 7-9 hours of quality sleep each night.",
      "Regular physical activity can boost your mood and energy levels.",
      "Include a variety of colorful fruits and vegetables in your diet.",
      "Take short breaks during work to reduce eye strain and mental fatigue.",
    ]
    setHealthTip(tips[Math.floor(Math.random() * tips.length)])
  }, [])

  useEffect(() => {
    if (!user && !loading) {
      const timeoutId = setTimeout(() => {
        setShowWelcomeMessage(true)
      }, 5000)
      return () => clearTimeout(timeoutId)
    } else {
      setShowWelcomeMessage(false)
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="container px-4 py-6 md:py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (showWelcomeMessage && !user) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[70vh] text-center"
        style={{
          backgroundImage: `url(/welcomePage.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          width: '100vw',
        }}>
        <div
          className="flex flex-col items-center justify-end text-center"
          style={{
            position: 'absolute',
            width: '80%',
            height: 'fit-content',
            bottom: '10px',
            backgroundColor: '#0A91F9',
            flex: '0 0 20vh',
            paddingBottom: '10px',
            paddingTop: '10px',
            borderRadius: '20px 20px 20px 20px',
          }}
          >

          <h1 className="text-3xl text-white font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground text-white font-bold mb-5 max-w-md">
            Your entire Hospital in your pocket
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{
              width: '80%',
            }}
          >
            <Button asChild size="lg"
              className="bg-primary"
              style={{
                width: '100%',
                border: '2px solid white',
                borderRadius: '10px',
                padding: '10px 20px',
                color: 'white',
              }}>
              <Link href="/login"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}>
                Login
              </Link>
            </Button>
            <Button asChild size="lg"
              className="bg-primary"
              style={{
                width: '100%',
                border: '2px solid white',
                borderRadius: '10px',
                padding: '10px 20px',
                color: 'white',
              }}>
              <Link href="/signup"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}>
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      {/* <DebugAuth /> */}
      {user ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {greeting}, {user.first_name} {user.last_name}
            </h1>
            <p className="text-muted-foreground">How are you feeling today?</p>
          </div>

          <Card className="mb-6 border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Health Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{healthTip}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Link href="/consultation" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Start Consultation</h3>
                    <p className="text-sm text-muted-foreground">Chat with our AI about your symptoms</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/chat" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mr-4">
                    <MessageSquare className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Chat with AI</h3>
                    <p className="text-sm text-muted-foreground">Get general health advice</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/appointments" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="h-10 w-10 rounded-full bg-tertiary/10 flex items-center justify-center mr-4">
                    <Calendar className="h-5 w-5 text-tertiary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Appointments</h3>
                    <p className="text-sm text-muted-foreground">View your schedule</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/health-tracker" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="h-10 w-10 rounded-full bg-accent/50 flex items-center justify-center mr-4">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Health Tracker</h3>
                    <p className="text-sm text-muted-foreground">Monitor your vitals</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/health-records" className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Health Records</h3>
                    <p className="text-sm text-muted-foreground">Access your medical history</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/emergency">
                <span className="text-red-500">Emergency Contact</span>
              </Link>
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}

