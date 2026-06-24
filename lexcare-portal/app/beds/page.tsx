"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bed, Search, User, Calendar, Plus } from "lucide-react"
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

interface BedInfo {
  id: string
  bed_number: string
  ward: string
  bed_type: string
  status: string
  patient_id: string | null
  assigned_date: string | null
  notes: string
  patient?: {
    full_name: string
    phone: string
  }
}

// Mock data for development
const mockBeds: BedInfo[] = [
  {
    id: "1",
    bed_number: "A101",
    ward: "General Ward A",
    bed_type: "general",
    status: "available",
    patient_id: null,
    assigned_date: null,
    notes: "Standard bed with basic amenities",
  },
  {
    id: "2",
    bed_number: "A102",
    ward: "General Ward A",
    bed_type: "general",
    status: "occupied",
    patient_id: "patient-1",
    assigned_date: "2024-01-15T10:00:00Z",
    notes: "Standard bed with basic amenities",
    patient: {
      full_name: "John Doe",
      phone: "+234 123 456 7894",
    },
  },
  {
    id: "3",
    bed_number: "B201",
    ward: "ICU Ward B",
    bed_type: "icu",
    status: "available",
    patient_id: null,
    assigned_date: null,
    notes: "ICU bed with advanced monitoring",
  },
  {
    id: "4",
    bed_number: "B202",
    ward: "ICU Ward B",
    bed_type: "icu",
    status: "occupied",
    patient_id: "patient-2",
    assigned_date: "2024-01-16T14:30:00Z",
    notes: "ICU bed with advanced monitoring",
    patient: {
      full_name: "Mary Johnson",
      phone: "+234 123 456 7896",
    },
  },
  {
    id: "5",
    bed_number: "C301",
    ward: "Private Ward C",
    bed_type: "private",
    status: "available",
    patient_id: null,
    assigned_date: null,
    notes: "Private room with attached bathroom",
  },
  {
    id: "6",
    bed_number: "C302",
    ward: "Private Ward C",
    bed_type: "private",
    status: "reserved",
    patient_id: null,
    assigned_date: null,
    notes: "Private room with attached bathroom",
  },
]

export default function BedManagementPage() {
  const [beds, setBeds] = useState<BedInfo[]>([])
  const [filteredBeds, setFilteredBeds] = useState<BedInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [wardFilter, setWardFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [user, setUser] = useState<any | null>(null) // Declare the user variable

  const [isAssignPatientOpen, setIsAssignPatientOpen] = useState(false)
  const [isAddBedOpen, setIsAddBedOpen] = useState(false)
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [newBed, setNewBed] = useState({
    bed_number: "",
    ward: "",
    bed_type: "",
    notes: "",
  })
  const [assignPatientForm, setAssignPatientForm] = useState({
    patient_id: "",
    reason_for_admission: "",
  })

  useEffect(() => {
    const loadBeds = async () => {
      const user = await getCurrentUser()
      if (!user) return

      setUserRole(user.role)
      setUser(user) // Set the user variable

      // Check if user has permission
      if (!hasPermission(user.role, ["doctor", "admin"])) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("beds")
          .select(`
            id,
            bed_number,
            ward,
            bed_type,
            status,
            patient_id,
            assigned_date,
            notes,
            patients(full_name, phone)
          `)
          .order("bed_number", { ascending: true })

        // Add this inside the loadBeds function
        const { data: patientsData } = await supabase
          .from("patients")
          .select("id, full_name, phone")
          .order("full_name", { ascending: true })

        if (patientsData) {
          setPatients(patientsData)
        }

        if (data && !error) {
          const formattedBeds = data.map((bed) => ({
            id: bed.id,
            bed_number: bed.bed_number,
            ward: bed.ward,
            bed_type: bed.bed_type,
            status: bed.status,
            patient_id: bed.patient_id,
            assigned_date: bed.assigned_date,
            notes: bed.notes || "",
            patient: bed.patients
              ? {
                  full_name: bed.patients.full_name,
                  phone: bed.patients.phone || "",
                }
              : undefined,
          }))
          setBeds(formattedBeds)
          setFilteredBeds(formattedBeds)
        } else {
          setBeds(mockBeds)
          setFilteredBeds(mockBeds)
        }
      } catch (error) {
        console.log("Database not available, using mock data")
        setBeds(mockBeds)
        setFilteredBeds(mockBeds)
      }

      setLoading(false)
    }

    loadBeds()
  }, [])

  useEffect(() => {
    const filtered = beds.filter((bed) => {
      const matchesSearch =
        bed.bed_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bed.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || bed.status === statusFilter
      const matchesWard = wardFilter === "all" || bed.ward === wardFilter

      return matchesSearch && matchesStatus && matchesWard
    })

    setFilteredBeds(filtered)
  }, [searchTerm, statusFilter, wardFilter, beds])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800"
      case "cleaning":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBedTypeColor = (type: string) => {
    switch (type) {
      case "icu":
        return "bg-purple-100 text-purple-800"
      case "private":
        return "bg-indigo-100 text-indigo-800"
      case "semi-private":
        return "bg-cyan-100 text-cyan-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAssignPatient = async () => {
    if (!selectedBed || !assignPatientForm.patient_id) return

    try {
      const { error: bedError } = await supabase
        .from("beds")
        .update({
          status: "occupied",
          patient_id: assignPatientForm.patient_id,
          assigned_date: new Date().toISOString(),
        })
        .eq("id", selectedBed.id)

      const { error: assignmentError } = await supabase.from("bed_assignments").insert([
        {
          bed_id: selectedBed.id,
          patient_id: assignPatientForm.patient_id,
          assigned_by: user?.id,
          reason_for_admission: assignPatientForm.reason_for_admission,
        },
      ])

      if (!bedError && !assignmentError) {
        // Update local state
        setBeds(
          beds.map((bed) =>
            bed.id === selectedBed.id
              ? {
                  ...bed,
                  status: "occupied",
                  patient_id: assignPatientForm.patient_id,
                  assigned_date: new Date().toISOString(),
                }
              : bed,
          ),
        )
        setIsAssignPatientOpen(false)
        setAssignPatientForm({ patient_id: "", reason_for_admission: "" })
      }
    } catch (error) {
      console.error("Error assigning patient:", error)
    }
  }

  const handleDischarge = async (bed: BedInfo) => {
    try {
      const { error: bedError } = await supabase
        .from("beds")
        .update({
          status: "available",
          patient_id: null,
          assigned_date: null,
          discharge_date: new Date().toISOString(),
        })
        .eq("id", bed.id)

      const { error: assignmentError } = await supabase
        .from("bed_assignments")
        .update({ discharge_date: new Date().toISOString() })
        .eq("bed_id", bed.id)
        .is("discharge_date", null)

      if (!bedError && !assignmentError) {
        setBeds(
          beds.map((b) =>
            b.id === bed.id
              ? { ...b, status: "available", patient_id: null, assigned_date: null, patient: undefined }
              : b,
          ),
        )
      }
    } catch (error) {
      console.error("Error discharging patient:", error)
    }
  }

  const handleAddBed = async () => {
    try {
      const { data, error } = await supabase
        .from("beds")
        .insert([{ ...newBed, status: "available" }])
        .select()

      if (data && !error) {
        setBeds([...beds, data[0]])
        setIsAddBedOpen(false)
        setNewBed({ bed_number: "", ward: "", bed_type: "", notes: "" })
      }
    } catch (error) {
      console.error("Error adding bed:", error)
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

  if (!hasPermission(userRole, ["doctor", "admin"])) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="text-center py-12">
            <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have permission to access bed management.</p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  const availableBeds = beds.filter((bed) => bed.status === "available").length
  const occupiedBeds = beds.filter((bed) => bed.status === "occupied").length
  const reservedBeds = beds.filter((bed) => bed.status === "reserved").length
  const maintenanceBeds = beds.filter((bed) => bed.status === "maintenance").length

  const wards = [...new Set(beds.map((bed) => bed.ward))]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Bed Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage hospital beds and patient assignments</p>
          </div>
          {hasPermission(userRole, ["admin"]) && (
            <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#021488] hover:bg-[#0546B6]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bed
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Bed</DialogTitle>
                  <DialogDescription>Create a new bed in the hospital system.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bed Number</label>
                    <Input
                      value={newBed.bed_number}
                      onChange={(e) => setNewBed({ ...newBed, bed_number: e.target.value })}
                      placeholder="e.g., A101"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ward</label>
                    <Input
                      value={newBed.ward}
                      onChange={(e) => setNewBed({ ...newBed, ward: e.target.value })}
                      placeholder="e.g., General Ward A"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bed Type</label>
                    <Select
                      value={newBed.bed_type}
                      onValueChange={(value) => setNewBed({ ...newBed, bed_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="icu">ICU</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="semi-private">Semi-Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={newBed.notes}
                      onChange={(e) => setNewBed({ ...newBed, notes: e.target.value })}
                      placeholder="Any additional notes about this bed..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddBedOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBed} className="bg-[#021488] hover:bg-[#0546B6]">
                    Add Bed
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready for patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Occupied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{occupiedBeds}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Reserved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reservedBeds}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reserved for patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{maintenanceBeds}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Under maintenance</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search beds by number, ward, or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={wardFilter} onValueChange={setWardFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wards</SelectItem>
                  {wards.map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Beds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeds.map((bed) => (
            <Card key={bed.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Bed {bed.bed_number}</CardTitle>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(bed.status)}>
                      {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
                    </Badge>
                    <Badge className={getBedTypeColor(bed.bed_type)}>
                      {bed.bed_type.charAt(0).toUpperCase() + bed.bed_type.slice(1)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{bed.ward}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bed.patient && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-[#0A91F9]" />
                      <span className="font-medium">{bed.patient.full_name}</span>
                    </div>
                    {bed.patient.phone && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{bed.patient.phone}</p>
                    )}
                    {bed.assigned_date && (
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <Calendar className="h-3 w-3" />
                        <span>Admitted: {new Date(bed.assigned_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {bed.notes && (
                  <div className="text-sm">
                    <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Notes:</p>
                    <p className="text-gray-600 dark:text-gray-400">{bed.notes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  {bed.status === "available" && hasPermission(userRole, ["admin", "doctor"]) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedBed(bed)
                        setIsAssignPatientOpen(true)
                      }}
                    >
                      Assign Patient
                    </Button>
                  )}
                  {bed.status === "occupied" && hasPermission(userRole, ["admin", "doctor"]) && (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDischarge(bed)}>
                      Discharge
                    </Button>
                  )}
                  {hasPermission(userRole, ["admin"]) && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBeds.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || statusFilter !== "all" || wardFilter !== "all" ? "No beds found" : "No beds available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all" || wardFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first bed."}
              </p>
              {!searchTerm && statusFilter === "all" && wardFilter === "all" && hasPermission(userRole, ["admin"]) && (
                <Dialog open={isAddBedOpen} onOpenChange={setIsAddBedOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#021488] hover:bg-[#0546B6]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Bed
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Bed</DialogTitle>
                      <DialogDescription>Create a new bed in the hospital system.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bed Number</label>
                        <Input
                          value={newBed.bed_number}
                          onChange={(e) => setNewBed({ ...newBed, bed_number: e.target.value })}
                          placeholder="e.g., A101"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ward</label>
                        <Input
                          value={newBed.ward}
                          onChange={(e) => setNewBed({ ...newBed, ward: e.target.value })}
                          placeholder="e.g., General Ward A"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bed Type</label>
                        <Select
                          value={newBed.bed_type}
                          onValueChange={(value) => setNewBed({ ...newBed, bed_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bed type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="icu">ICU</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="semi-private">Semi-Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                          value={newBed.notes}
                          onChange={(e) => setNewBed({ ...newBed, notes: e.target.value })}
                          placeholder="Any additional notes about this bed..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddBedOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddBed} className="bg-[#021488] hover:bg-[#0546B6]">
                        Add Bed
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {/* Assign Patient Dialog */}
      <Dialog open={isAssignPatientOpen} onOpenChange={setIsAssignPatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed {selectedBed?.bed_number}</DialogTitle>
            <DialogDescription>Select a patient to assign to this bed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Select
                value={assignPatientForm.patient_id}
                onValueChange={(value) => setAssignPatientForm({ ...assignPatientForm, patient_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason for Admission</label>
              <Textarea
                value={assignPatientForm.reason_for_admission}
                onChange={(e) => setAssignPatientForm({ ...assignPatientForm, reason_for_admission: e.target.value })}
                placeholder="Enter reason for admission..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignPatientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPatient} className="bg-[#021488] hover:bg-[#0546B6]">
              Assign Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
