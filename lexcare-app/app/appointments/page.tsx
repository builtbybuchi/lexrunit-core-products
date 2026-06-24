"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Clock, User, MapPin, FileText } from "lucide-react"
import { hmsService } from "@/lib/supabase-hms"

type Appointment = {
  id: string
  doctor_name: string
  department: string
  date: string
  time: string
  location: string
  notes?: string
  status: "upcoming" | "completed" | "cancelled"
}

export default function Appointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadAppointments()
    }
  }, [user])

  const loadAppointments = async () => {
    if (!user) return

    try {
      const appointments = await hmsService.getAppointments(user.id)
      setAppointments(appointments as Appointment[])
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load appointments.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment)
    setShowRescheduleDialog(true)
  }

  const confirmReschedule = async () => {
    if (!rescheduleAppointment || !selectedDate || !user) return

    try {
      const newDate = selectedDate.toISOString()
      await hmsService.rescheduleAppointment(rescheduleAppointment.id, newDate)

      // Update local state
      setAppointments((prev) =>
        prev.map((app) => (app.id === rescheduleAppointment.id ? { ...app, date: newDate.split("T")[0] } : app)),
      )

      toast({
        title: "Appointment rescheduled",
        description: `Your appointment has been rescheduled to ${selectedDate.toLocaleDateString()}.`,
      })

      setShowRescheduleDialog(false)
      setRescheduleAppointment(null)
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reschedule appointment.",
      })
    }
  }

  const cancelAppointment = async (id: string) => {
    if (!user) return

    try {
      await hmsService.cancelAppointment(id)

      // Update local state
      setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, status: "cancelled" } : app)))

      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled.",
      })
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment.",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filterAppointments = (status: string) => {
    return appointments.filter((appointment) => {
      if (status === "upcoming") {
        return appointment.status === "upcoming" && new Date(appointment.date) >= new Date()
      }
      if (status === "past") {
        return (
          appointment.status === "completed" ||
          (appointment.status === "upcoming" && new Date(appointment.date) < new Date())
        )
      }
      return appointment.status === status
    })
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{appointment.doctor_name}</h3>
              <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{appointment.department}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{new Date(appointment.date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{appointment.location}</span>
              </div>

              {appointment.notes && (
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 mt-0.5" />
                  <span>{appointment.notes}</span>
                </div>
              )}
            </div>
          </div>

          {appointment.status === "upcoming" && (
            <div className="flex flex-col gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment)}>
                Reschedule
              </Button>
              <Button variant="destructive" size="sm" onClick={() => cancelAppointment(appointment.id)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filterAppointments("upcoming").length > 0 ? (
                filterAppointments("upcoming").map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="mt-4 text-muted-foreground">No upcoming appointments</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filterAppointments("past").length > 0 ? (
                filterAppointments("past").map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="mt-4 text-muted-foreground">No past appointments</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filterAppointments("cancelled").length > 0 ? (
                filterAppointments("cancelled").map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                    <p className="mt-4 text-muted-foreground">No cancelled appointments</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date for your appointment with {rescheduleAppointment?.doctor_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule} disabled={!selectedDate}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
