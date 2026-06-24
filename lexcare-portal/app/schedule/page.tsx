"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Appointment {
  id: string
  appointment_date: string
  duration: number
  status: string
  notes: string
  patient: {
    full_name: string
    phone: string
  }
}

export default function SchedulePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [newAppointment, setNewAppointment] = useState({
    patient_id: "",
    appointment_date: "",
    appointment_time: "",
    duration: 30,
    notes: "",
  })

  useEffect(() => {
    const loadAppointments = async () => {
      const user = await getCurrentUser()
      if (!user) return

      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          duration,
          status,
          notes,
          patients(full_name, phone)
        `)
        .eq("doctor_id", user.id)
        .order("appointment_date", { ascending: true })

      // Add this inside the loadAppointments function
      const { data: patientsData } = await supabase
        .from("patients")
        .select("id, full_name")
        .order("full_name", { ascending: true })

      if (patientsData) {
        setPatients(patientsData)
      }

      if (data && !error) {
        const formattedAppointments = data.map((apt) => ({
          id: apt.id,
          appointment_date: apt.appointment_date,
          duration: apt.duration,
          status: apt.status,
          notes: apt.notes || "",
          patient: {
            full_name: apt.patients?.full_name || "Unknown Patient",
            phone: apt.patients?.phone || "",
          },
        }))
        setAppointments(formattedAppointments)
      }

      setLoading(false)
    }

    loadAppointments()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateAppointment = async () => {
    const user = await getCurrentUser()
    if (!user || !newAppointment.patient_id || !newAppointment.appointment_date || !newAppointment.appointment_time)
      return

    const appointmentDateTime = `${newAppointment.appointment_date}T${newAppointment.appointment_time}:00`

    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            patient_id: newAppointment.patient_id,
            doctor_id: user.id,
            appointment_date: appointmentDateTime,
            duration: newAppointment.duration,
            notes: newAppointment.notes,
            status: "scheduled",
          },
        ])
        .select(`
          id,
          appointment_date,
          duration,
          status,
          notes,
          patients(full_name, phone)
        `)

      if (data && !error) {
        const formattedAppointment = {
          id: data[0].id,
          appointment_date: data[0].appointment_date,
          duration: data[0].duration,
          status: data[0].status,
          notes: data[0].notes || "",
          patient: {
            full_name: data[0].patients?.full_name || "Unknown Patient",
            phone: data[0].patients?.phone || "",
          },
        }
        setAppointments([...appointments, formattedAppointment])
        setIsNewAppointmentOpen(false)
        setNewAppointment({
          patient_id: "",
          appointment_date: "",
          appointment_time: "",
          duration: 30,
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error creating appointment:", error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#021488]"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Schedule</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your appointments and schedule</p>
          </div>
          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
                <DialogDescription>Create a new appointment with a patient.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Patient</label>
                  <Select
                    value={newAppointment.patient_id}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, patient_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={newAppointment.appointment_date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input
                      type="time"
                      value={newAppointment.appointment_time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={newAppointment.duration}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, duration: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    placeholder="Any additional notes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAppointment} className="bg-[#021488] hover:bg-[#0546B6]">
                  Schedule Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{appointment.patient.full_name}</CardTitle>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{appointment.patient.phone}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#0A91F9]" />
                  <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-[#0A91F9]" />
                  <span>
                    {new Date(appointment.appointment_date).toLocaleTimeString()}({appointment.duration} min)
                  </span>
                </div>
                {appointment.notes && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Notes:</p>
                    <p>{appointment.notes}</p>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {appointments.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No appointments scheduled</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any appointments scheduled yet.</p>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                Schedule First Appointment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
