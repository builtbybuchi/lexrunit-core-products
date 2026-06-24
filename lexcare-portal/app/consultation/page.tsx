"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, User, Calendar, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, hasPermission } from "@/lib/auth"
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
import { Mic, Video, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Consultation {
  id: string
  consultation_date: string
  symptoms: string
  diagnosis: string
  treatment: string
  prescription: string
  follow_up_date: string
  notes: string
  patient: {
    full_name: string
    phone: string
  }
}

export default function ConsultationPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState<"audio" | "video" | null>(null)
  const [newConsultation, setNewConsultation] = useState({
    patient_id: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    follow_up_date: "",
    notes: "",
  })

  useEffect(() => {
    const loadConsultations = async () => {
      const user = await getCurrentUser()
      if (!user) return

      setUserRole(user.role)

      // Check if user has permission to view consultations
      if (!hasPermission(user.role, ["doctor", "admin"])) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("consultations")
        .select(`
          id,
          consultation_date,
          symptoms,
          diagnosis,
          treatment,
          prescription,
          follow_up_date,
          notes,
          patients(full_name, phone)
        `)
        .eq("doctor_id", user.id)
        .order("consultation_date", { ascending: false })

      const { data: patientsData } = await supabase
        .from("patients")
        .select("id, full_name")
        .order("full_name", { ascending: true })

      if (patientsData) {
        setPatients(patientsData)
      }

      if (data && !error) {
        const formattedConsultations = data.map((consultation) => ({
          id: consultation.id,
          consultation_date: consultation.consultation_date,
          symptoms: consultation.symptoms || "",
          diagnosis: consultation.diagnosis || "",
          treatment: consultation.treatment || "",
          prescription: consultation.prescription || "",
          follow_up_date: consultation.follow_up_date || "",
          notes: consultation.notes || "",
          patient: {
            full_name: consultation.patients?.full_name || "Unknown Patient",
            phone: consultation.patients?.phone || "",
          },
        }))
        setConsultations(formattedConsultations)
      }

      setLoading(false)
    }

    loadConsultations()
  }, [])

  const handleCreateConsultation = async () => {
    const user = await getCurrentUser()
    if (!user || !newConsultation.patient_id) return

    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert([
          {
            patient_id: newConsultation.patient_id,
            doctor_id: user.id,
            symptoms: newConsultation.symptoms,
            diagnosis: newConsultation.diagnosis,
            treatment: newConsultation.treatment,
            prescription: newConsultation.prescription,
            follow_up_date: newConsultation.follow_up_date || null,
            notes: newConsultation.notes,
          },
        ])
        .select(`
          id,
          consultation_date,
          symptoms,
          diagnosis,
          treatment,
          prescription,
          follow_up_date,
          notes,
          patients(full_name, phone)
        `)

      if (data && !error) {
        const formattedConsultation = {
          id: data[0].id,
          consultation_date: data[0].consultation_date,
          symptoms: data[0].symptoms || "",
          diagnosis: data[0].diagnosis || "",
          treatment: data[0].treatment || "",
          prescription: data[0].prescription || "",
          follow_up_date: data[0].follow_up_date || "",
          notes: data[0].notes || "",
          patient: {
            full_name: data[0].patients?.full_name || "Unknown Patient",
            phone: data[0].patients?.phone || "",
          },
        }
        setConsultations([formattedConsultation, ...consultations])
        setIsNewConsultationOpen(false)
        setNewConsultation({
          patient_id: "",
          symptoms: "",
          diagnosis: "",
          treatment: "",
          prescription: "",
          follow_up_date: "",
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error creating consultation:", error)
    }
  }

  const startRecording = (type: "audio" | "video") => {
    setRecordingType(type)
    setIsRecording(true)
    // In a real implementation, you would start actual recording here
    console.log(`Starting ${type} recording...`)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setRecordingType(null)
    // In a real implementation, you would stop recording and save the file
    console.log("Stopping recording...")
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

  if (!hasPermission(userRole, ["doctor", "admin"])) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="text-center py-12">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access consultation records.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Consultations</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage patient consultations and medical records</p>
          </div>
          <Dialog open={isNewConsultationOpen} onOpenChange={setIsNewConsultationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                New Consultation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Physical Consultation</DialogTitle>
                <DialogDescription>Record a new patient consultation with audio/video capture.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient</label>
                    <Select
                      value={newConsultation.patient_id}
                      onValueChange={(value) => setNewConsultation({ ...newConsultation, patient_id: value })}
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Symptoms</label>
                    <Textarea
                      value={newConsultation.symptoms}
                      onChange={(e) => setNewConsultation({ ...newConsultation, symptoms: e.target.value })}
                      placeholder="Describe patient symptoms..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diagnosis</label>
                    <Textarea
                      value={newConsultation.diagnosis}
                      onChange={(e) => setNewConsultation({ ...newConsultation, diagnosis: e.target.value })}
                      placeholder="Enter diagnosis..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Treatment</label>
                    <Textarea
                      value={newConsultation.treatment}
                      onChange={(e) => setNewConsultation({ ...newConsultation, treatment: e.target.value })}
                      placeholder="Prescribed treatment..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recording Controls</label>
                    <div className="flex space-x-2">
                      <Button
                        variant={isRecording && recordingType === "audio" ? "destructive" : "outline"}
                        onClick={() => (isRecording ? stopRecording() : startRecording("audio"))}
                        className="flex-1"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {isRecording && recordingType === "audio" ? "Stop Audio" : "Record Audio"}
                      </Button>
                      <Button
                        variant={isRecording && recordingType === "video" ? "destructive" : "outline"}
                        onClick={() => (isRecording ? stopRecording() : startRecording("video"))}
                        className="flex-1"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        {isRecording && recordingType === "video" ? "Stop Video" : "Record Video"}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="text-center text-sm text-red-600">
                        Recording {recordingType}... Click stop when finished.
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prescription</label>
                    <Textarea
                      value={newConsultation.prescription}
                      onChange={(e) => setNewConsultation({ ...newConsultation, prescription: e.target.value })}
                      placeholder="Prescribed medications..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Follow-up Date</label>
                    <Input
                      type="date"
                      value={newConsultation.follow_up_date}
                      onChange={(e) => setNewConsultation({ ...newConsultation, follow_up_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <Textarea
                      value={newConsultation.notes}
                      onChange={(e) => setNewConsultation({ ...newConsultation, notes: e.target.value })}
                      placeholder="Any additional notes..."
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewConsultationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConsultation} className="bg-[#021488] hover:bg-[#0546B6]">
                  <FileText className="h-4 w-4 mr-2" />
                  Save Consultation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{consultation.patient.full_name}</CardTitle>
                  <Badge variant="outline">{new Date(consultation.consultation_date).toLocaleDateString()}</Badge>
                </div>
                <CardDescription className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{consultation.patient.phone}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultation.symptoms && (
                  <div>
                    <h4 className="font-medium text-sm text-[#021488] dark:text-[#C5ECF4] mb-1">Symptoms</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.symptoms}</p>
                  </div>
                )}

                {consultation.diagnosis && (
                  <div>
                    <h4 className="font-medium text-sm text-[#021488] dark:text-[#C5ECF4] mb-1">Diagnosis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.diagnosis}</p>
                  </div>
                )}

                {consultation.treatment && (
                  <div>
                    <h4 className="font-medium text-sm text-[#021488] dark:text-[#C5ECF4] mb-1">Treatment</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.treatment}</p>
                  </div>
                )}

                {consultation.prescription && (
                  <div>
                    <h4 className="font-medium text-sm text-[#021488] dark:text-[#C5ECF4] mb-1">Prescription</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.prescription}</p>
                  </div>
                )}

                {consultation.follow_up_date && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#0A91F9]" />
                    <span>Follow-up: {new Date(consultation.follow_up_date).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {consultations.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No consultations recorded</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by recording your first patient consultation.
              </p>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                Record First Consultation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
