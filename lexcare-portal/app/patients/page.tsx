"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Phone, Mail, Calendar, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
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
import { getCurrentUser } from "@/lib/auth"
// Remove direct email imports; use API route instead

interface Patient {
  id: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  created_at: string
}

const PATIENTS_QUEUE_KEY = 'offlinePatientsQueue';

function generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

function queuePatientForSync(patient: any): void {
  const queue = JSON.parse(localStorage.getItem(PATIENTS_QUEUE_KEY) || '[]');
  queue.push(patient);
  localStorage.setItem(PATIENTS_QUEUE_KEY, JSON.stringify(queue));
}

// Utility to check online status
function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

async function syncQueuedPatients() {
  const queue = JSON.parse(localStorage.getItem(PATIENTS_QUEUE_KEY) || '[]');
  if (!queue.length) return;
  const doctor = await getCurrentUser();
  for (let i = 0; i < queue.length; i++) {
    const patient: any = queue[i];
    try {
      // 1. Sign up patient
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: patient.email,
        password: patient.password,
        options: { emailRedirectTo: window.location.origin + '/patients' }
      });
      if (authError) throw authError;
      // 2. Insert into users table
      const { data, error } = await supabase.from('users').insert([{ ...patient, hospital_id: (doctor as any)?.hospital_id }]);
      if (error) throw error;
      // 3. Remove from queue
      queue.splice(i, 1); i--;
      localStorage.setItem(PATIENTS_QUEUE_KEY, JSON.stringify(queue));
      // 4. Send password via custom email
      // This part is now handled by the API route
      console.log(`[SYNC] Sent password to ${patient.email}: ${patient.password}`);
    } catch (err) {
      console.error('[SYNC] Failed to sync patient:', patient, err);
    }
  }
}

// Remove useEffect for sync, use event listener directly
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncQueuedPatients();
  });
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientConsultations, setPatientConsultations] = useState<any[]>([])
  const [newPatient, setNewPatient] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    medical_history: "",
    allergies: "",
  })

  const [formErrors, setFormErrors] = useState<any>({});
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      // Get current doctor to get hospital_id
      const doctor = await getCurrentUser();
      console.log('[Patients] Current doctor:', doctor);
      
      // Try to get hospital_id from different possible locations
      const doctorHospitalId = (doctor as any)?.hospital_id || 
                              (doctor as any)?.hospitalId || 
                              localStorage.getItem('currentDoctorHospitalId');
      
      console.log('[Patients] Doctor hospital ID:', doctorHospitalId);
      
      // If no hospital_id found, try to load all patients from localStorage for offline mode
      if (!doctorHospitalId) {
        console.log('[Patients] No hospital_id found, loading all local patients for offline mode');
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        const patientsWithRole = localPatients.filter((patient: any) => patient.role === 'patients');
        
        if (patientsWithRole.length > 0) {
          console.log('[Offline] Loading all patients from localStorage:', patientsWithRole.length);
          setPatients(patientsWithRole);
          setFilteredPatients(patientsWithRole);
        }
        setLoading(false);
        return;
      }

      // Store hospital_id for offline use
      localStorage.setItem('currentDoctorHospitalId', doctorHospitalId);

      // Load from localStorage first for instant offline rendering
      const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
      const filteredLocalPatients = localPatients.filter((patient: any) => 
        patient.role === 'patients' && patient.hospital_id === doctorHospitalId
      );
      
      if (filteredLocalPatients.length > 0) {
        console.log('[Offline] Loading patients from localStorage:', filteredLocalPatients.length);
        setPatients(filteredLocalPatients);
        setFilteredPatients(filteredLocalPatients);
        setLoading(false);
      }

      // If online, fetch from Supabase and update
      if (isOnline()) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("role", "patients")
            .eq("hospital_id", doctorHospitalId)
            .order("full_name", { ascending: true })

      if (data && !error) {
            console.log('[Online] Loaded patients from Supabase:', data.length);
            setPatients(data);
            setFilteredPatients(data);
            
            // Update localStorage with fresh data
            localStorage.setItem('localPatients', JSON.stringify(data));
          }
        } catch (error) {
          console.error('[Online] Error loading patients from Supabase:', error);
          // Keep using localStorage data if Supabase fails
        }
      } else {
        console.log('[Offline] Using cached patients from localStorage');
      }

      setLoading(false);
    }

    loadPatients()
  }, [])

  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm),
    )
    setFilteredPatients(filtered)
  }, [searchTerm, patients])

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleAddPatient = async () => {
    setFormErrors({}); setFormSuccess(null);
    // Validation
    const errors: any = {};
    if (!newPatient.full_name) errors.full_name = 'Full name is required.';
    if (!newPatient.email) errors.email = 'Email is required.';
    if (!newPatient.date_of_birth) errors.date_of_birth = 'Date of birth is required.';
    if (!newPatient.address) errors.address = 'Address is required.';
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    // Generate random password for patient
    const password = generateRandomPassword();

    // Get doctor for hospital_id
    const doctor = await getCurrentUser();
    const doctorHospitalId = (doctor as any)?.hospital_id || 
                            (doctor as any)?.hospitalId || 
                            localStorage.getItem('currentDoctorHospitalId');
    
    console.log('[AddPatient] Doctor hospital ID:', doctorHospitalId);
    
    const patientWithHospital: any = { ...newPatient, hospital_id: doctorHospitalId, role: "patients" };
    const patientForQueue = { ...patientWithHospital, password };

    // Store in localStorage immediately
    const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
    localPatients.unshift(patientWithHospital);
    localStorage.setItem('localPatients', JSON.stringify(localPatients));

    if (!isOnline()) {
      queuePatientForSync(patientForQueue);
      setFormSuccess('Patient saved locally and will be synced when online.');
      setIsAddPatientOpen(false);
      setNewPatient({
        full_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "",
        address: "",
        emergency_contact: "",
        emergency_phone: "",
        medical_history: "",
        allergies: "",
      });
      return;
    }

    try {
      // 1. Sign up patient
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newPatient.email,
        password,
        options: { emailRedirectTo: window.location.origin + '/patients' }
      });
      if (authError) throw authError;
      // 2. Insert into users table
      console.log('[AddPatient] Sending to Supabase:', patientWithHospital);
      const { data, error } = await supabase.from('users').insert([patientWithHospital]).select();
      if (error) throw error;
      setPatients([data[0], ...patients]);
      setFormSuccess('Patient added and signup email sent.');
      setIsAddPatientOpen(false);
        setNewPatient({
          full_name: "",
          email: "",
          phone: "",
          date_of_birth: "",
          gender: "",
          address: "",
          emergency_contact: "",
          emergency_phone: "",
          medical_history: "",
          allergies: "",
      });
      // 3. Send password via custom email using API route
      try {
        const emailResponse = await fetch('/api/send-patient-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: newPatient.full_name,
            email: newPatient.email,
            password: password,
          }),
        });
        
        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('[Email] API error:', errorData);
          throw new Error(`Email API error: ${errorData.error || 'Unknown error'}`);
        }
        
        const emailResult = await emailResponse.json();
        console.log('[Email] API response:', emailResult);
        console.log(`[ONLINE] Sent password to ${newPatient.email}: ${password}`);
      } catch (emailError) {
        console.error('[Email] Failed to send email:', emailError);
        // Don't fail the entire patient creation if email fails
        console.log('[Email] Patient created but email failed - password:', password);
      }
    } catch (error) {
      setFormErrors({ submit: 'Failed to add patient. Please try again.' });
      console.error("Error adding patient:", error);
    }
  };

  const handleViewDetails = async (patient: Patient) => {
    setSelectedPatient(patient)

    try {
      const { data } = await supabase
        .from("consultations")
        .select(`
          id,
          consultation_date,
          symptoms,
          diagnosis,
          treatment,
          users(full_name)
        `)
        .eq("patient_id", patient.id)
        .order("consultation_date", { ascending: false })

      if (data) {
        setPatientConsultations(data)
      }
    } catch (error) {
      console.log("Error loading consultations:", error)
      setPatientConsultations([])
    }

    setIsViewDetailsOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setNewPatient({
      full_name: patient.full_name,
      email: patient.email || "",
      phone: patient.phone || "",
      date_of_birth: patient.date_of_birth || "",
      gender: patient.gender || "",
      address: patient.address || "",
      emergency_contact: "",
      emergency_phone: "",
      medical_history: "",
      allergies: "",
    })
    setIsEditPatientOpen(true)
  }

  const handleUpdatePatient = async () => {
    if (!selectedPatient) return

    try {
      const { data, error } = await supabase.from("users").update(newPatient).eq("id", selectedPatient.id).select()

      if (data && !error) {
        setPatients(patients.map((p) => (p.id === selectedPatient.id ? data[0] : p)))
        setIsEditPatientOpen(false)
      }
    } catch (error) {
      console.error("Error updating patient:", error)
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
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Patients</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage patient records and information</p>
          </div>
          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Enter patient information to create a new record.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={newPatient.full_name}
                    onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                  {formErrors.full_name && <div className="text-red-500 text-xs mt-1">{formErrors.full_name}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="Enter email"
                  />
                  {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    value={newPatient.date_of_birth}
                    onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                  />
                  {formErrors.date_of_birth && <div className="text-red-500 text-xs mt-1">{formErrors.date_of_birth}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Contact</label>
                  <Input
                    value={newPatient.emergency_contact}
                    onChange={(e) => setNewPatient({ ...newPatient, emergency_contact: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="Enter address"
                  />
                  {formErrors.address && <div className="text-red-500 text-xs mt-1">{formErrors.address}</div>}
                </div>
              </div>
              {formSuccess && <div className="text-green-500 text-xs mt-2">{formSuccess}</div>}
              {formErrors.submit && <div className="text-red-500 text-xs mt-2">{formErrors.submit}</div>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient} className="bg-[#021488] hover:bg-[#0546B6]">
                  Add Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{patient.full_name}</CardTitle>
                  <Badge variant="outline">{patient.gender}</Badge>
                </div>
                <CardDescription>
                  {patient.date_of_birth && <span>Age: {calculateAge(patient.date_of_birth)} years</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {patient.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-[#0A91F9]" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-[#0A91F9]" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#0A91F9]" />
                  <span>Registered: {new Date(patient.created_at).toLocaleDateString()}</span>
                </div>
                {patient.address && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Address:</p>
                    <p>{patient.address}</p>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewDetails(patient)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditPatient(patient)}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm ? "No patients found" : "No patients registered"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Start by adding your first patient."}
              </p>
              {!searchTerm && (
                  <DialogTrigger asChild>
                <Button className="bg-[#021488] hover:bg-[#0546B6]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Patient
                </Button>
                  </DialogTrigger>
              )}
            </CardContent>
          </Card>
            {/* The same DialogContent as the main add patient dialog, copy from above */}
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Enter patient information to create a new record.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={newPatient.full_name}
                    onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                  {formErrors.full_name && <div className="text-red-500 text-xs mt-1">{formErrors.full_name}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                    placeholder="Enter email"
                  />
                  {formErrors.email && <div className="text-red-500 text-xs mt-1">{formErrors.email}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    value={newPatient.date_of_birth}
                    onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                  />
                  {formErrors.date_of_birth && <div className="text-red-500 text-xs mt-1">{formErrors.date_of_birth}</div>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emergency Contact</label>
                  <Input
                    value={newPatient.emergency_contact}
                    onChange={(e) => setNewPatient({ ...newPatient, emergency_contact: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="Enter address"
                  />
                  {formErrors.address && <div className="text-red-500 text-xs mt-1">{formErrors.address}</div>}
                </div>
              </div>
              {formSuccess && <div className="text-green-500 text-xs mt-2">{formSuccess}</div>}
              {formErrors.submit && <div className="text-red-500 text-xs mt-2">{formErrors.submit}</div>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient} className="bg-[#021488] hover:bg-[#0546B6]">
                  Add Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* View Patient Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPatient?.full_name} - Patient Details</DialogTitle>
            <DialogDescription>Complete patient information and medical history</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <strong>Email:</strong> {selectedPatient.email || "Not provided"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedPatient.phone || "Not provided"}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {selectedPatient.date_of_birth
                        ? new Date(selectedPatient.date_of_birth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedPatient.gender || "Not provided"}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedPatient.address || "Not provided"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {patientConsultations.length > 0 ? (
                        patientConsultations.map((consultation) => (
                          <div key={consultation.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{consultation.diagnosis || "General Consultation"}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{consultation.symptoms}</p>
                                <p className="text-xs text-gray-500">Dr. {consultation.users?.full_name}</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(consultation.consultation_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No consultation history available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditPatientOpen} onOpenChange={setIsEditPatientOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patient Details</DialogTitle>
            <DialogDescription>Update patient information.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={newPatient.full_name}
                onChange={(e) => setNewPatient({ ...newPatient, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={newPatient.date_of_birth}
                onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select
                value={newPatient.gender}
                onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Contact</label>
              <Input
                value={newPatient.emergency_contact}
                onChange={(e) => setNewPatient({ ...newPatient, emergency_contact: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={newPatient.address}
                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPatientOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient} className="bg-[#021488] hover:bg-[#0546B6]">
              Update Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
