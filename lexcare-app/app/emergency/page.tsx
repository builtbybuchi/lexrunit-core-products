"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Phone } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Emergency() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const emergencyNumber = "+1-800-HOSPITAL" // Replace with actual emergency number

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (isCountingDown && countdown === 0) {
      handleEmergencyCall()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isCountingDown, countdown])

  const startEmergencyProcess = () => {
    setShowConfirmation(true)
  }

  const confirmEmergency = () => {
    setShowConfirmation(false)
    setIsCountingDown(true)
  }

  const cancelEmergency = () => {
    setShowConfirmation(false)
    setIsCountingDown(false)
    setCountdown(10)
  }

  const handleEmergencyCall = () => {
    setIsCountingDown(false)
    // In a real app, this would use the device's phone capabilities
    // For web, we'll simulate with a link
    window.location.href = `tel:${emergencyNumber}`
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Emergency Contact</h1>

      <Card className="mb-6 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Emergency Services</CardTitle>
          <CardDescription>
            Use this feature only in case of a medical emergency that requires immediate attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This will initiate a call to emergency medical services. Only use in case of a genuine emergency.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p>Examples of medical emergencies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Severe chest pain or difficulty breathing</li>
              <li>Severe bleeding that cannot be stopped</li>
              <li>Sudden loss of consciousness</li>
              <li>Severe burns or injuries</li>
              <li>Signs of stroke (facial drooping, arm weakness, speech difficulties)</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" size="lg" className="w-full" onClick={startEmergencyProcess}>
            <Phone className="mr-2 h-5 w-5" />
            Emergency Call
          </Button>
        </CardFooter>
      </Card>

      {isCountingDown && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">Calling emergency services in:</p>
              <p className="text-4xl font-bold my-4 text-red-600 dark:text-red-400">{countdown} seconds</p>
              <Button
                variant="outline"
                onClick={cancelEmergency}
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Cancel Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Other Important Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <p className="font-medium">Hospital Reception</p>
                <p className="text-sm text-muted-foreground">For general inquiries</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+1-800-HOSPITAL">Call</a>
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <p className="font-medium">Nurse Helpline</p>
                <p className="text-sm text-muted-foreground">For medical advice</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+1-800-NURSE">Call</a>
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <p className="font-medium">Poison Control</p>
                <p className="text-sm text-muted-foreground">For poison emergencies</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="tel:+1-800-POISON">Call</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Emergency Call Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure this is an emergency that requires immediate medical attention? This will initiate a call to
              emergency services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelEmergency}>No, Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEmergency} className="bg-red-600 hover:bg-red-700">
              Yes, It's an Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
