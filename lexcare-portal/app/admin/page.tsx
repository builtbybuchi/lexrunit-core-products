"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, Users, Calendar, Package, Bed, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalPatients: number
  totalStaff: number
  todayAppointments: number
  unreadMessages: number
  lowStockItems: number
  completedConsultations: number
  availableBeds: number
  occupiedBeds: number
}

// Mock data for charts
const monthlyConsultations = [
  { month: "Jan", consultations: 45 },
  { month: "Feb", consultations: 52 },
  { month: "Mar", consultations: 48 },
  { month: "Apr", consultations: 61 },
  { month: "May", consultations: 55 },
  { month: "Jun", consultations: 67 },
]

const bedOccupancy = [
  { ward: "General A", occupied: 8, total: 12 },
  { ward: "General B", occupied: 6, total: 10 },
  { ward: "ICU", occupied: 3, total: 6 },
  { ward: "Private", occupied: 4, total: 8 },
]

const inventoryStatus = [
  { name: "In Stock", value: 65, color: "#10B981" },
  { name: "Low Stock", value: 25, color: "#F59E0B" },
  { name: "Out of Stock", value: 10, color: "#EF4444" },
]

// Staff queue key for offline
const STAFF_QUEUE_KEY = 'offlineStaffQueue';

function generateRandomPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

function queueStaffForSync(staff: any): void {
  const queue = JSON.parse(localStorage.getItem(STAFF_QUEUE_KEY) || '[]');
  queue.push(staff);
  localStorage.setItem(STAFF_QUEUE_KEY, JSON.stringify(queue));
}

async function syncQueuedStaff(userHospitalId: string | null) {
  const queue = JSON.parse(localStorage.getItem(STAFF_QUEUE_KEY) || '[]');
  if (!queue.length) return;
  for (let i = 0; i < queue.length; i++) {
    const staff: any = queue[i];
    try {
      // 1. Sign up staff
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: staff.email,
        password: staff.password,
        options: { emailRedirectTo: window.location.origin + '/admin' }
      });
      if (authError) throw authError;
      // 2. Insert into users table
      const { error } = await supabase.from('users').insert([{ ...staff, hospital_id: userHospitalId }]);
      if (error) throw error;
      // 3. Remove from queue
      queue.splice(i, 1); i--;
      localStorage.setItem(STAFF_QUEUE_KEY, JSON.stringify(queue));
      // 4. (Optional) Send password via email (API route)
      console.log(`[SYNC] Sent password to ${staff.email}: ${staff.password}`);
    } catch (err) {
      console.error('[SYNC] Failed to sync staff:', staff, err);
    }
  }
}

// Sync staff queue on reconnect
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncQueuedStaff(localStorage.getItem('currentDoctorHospitalId'));
  });
}

export default function AdminDashboardPage() {
  // Staff dialog state (move to top)
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [staffSearch, setStaffSearch] = useState("");
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalStaff: 0,
    todayAppointments: 0,
    unreadMessages: 0,
    lowStockItems: 0,
    completedConsultations: 0,
    availableBeds: 0,
    occupiedBeds: 0,
  })
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [userHospitalId, setUserHospitalId] = useState<string | null>(null)
  const [bedDialogOpen, setBedDialogOpen] = useState(false)
  const [wards, setWards] = useState([{ name: "", rooms: "" }])
  const [wardsLoading, setWardsLoading] = useState(false)
  const [savingWards, setSavingWards] = useState(false)
  const { toast } = useToast()
  const [offline, setOffline] = useState(!isOnline())
  const [numberOfBeds, setNumberOfBeds] = useState<string>("");

  // Chart data state (for offline)
  const [chartData, setChartData] = useState(() => loadDashboardChartsOffline() || {
    monthlyConsultations,
    bedOccupancy,
    inventoryStatus,
  })

  // Listen for online/offline events
  useEffect(() => {
    function handleOnline() { setOffline(false) }
    function handleOffline() { setOffline(true) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Offline-first dashboard stats and charts
  useEffect(() => {
    // 1. Try to load stats from localStorage first
    const offlineStats = loadDashboardStatsOffline()
    if (offlineStats) setStats(offlineStats)
    // 2. Try to load charts from localStorage first
    const offlineCharts = loadDashboardChartsOffline()
    if (offlineCharts) setChartData(offlineCharts)

    // 3. Load user role from localStorage if offline
    if (!isOnline()) {
      const data = localStorage.getItem('doctorProfileDetails');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.profile && parsed.profile.role) {
            setUserRole(parsed.profile.role);
            setUserHospitalId(parsed.profile.hospital_id || null);
          }
        } catch (e) {}
      }
      setLoading(false);
      return;
    }

    // 4. If online, fetch from Supabase and update localStorage
    if (isOnline()) {
      const loadDashboardData = async () => {
        const user = await getCurrentUser()
        if (!user) { setLoading(false); return }
        setUserRole(user.role)
        setUserHospitalId((user as any).hospital_id || null)
        if (!hasPermission(user.role, ["admin", "doctor"])) {
          setLoading(false)
          return
        }
        try {
          const today = new Date().toISOString().split("T")[0]
          // Total patients from users table
          const { count: patientsCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "patients")
            .eq("hospital_id", (user as any).hospital_id)
          // Total staff (doctor or staff)
          const { count: staffCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .in("role", ["doctor", "staff"])
            .eq("hospital_id", (user as any).hospital_id)
          const { count: appointmentsCount } = await supabase
            .from("appointments")
            .select("*", { count: "exact", head: true })
            .eq("hospital_id", (user as any).hospital_id)
            .gte("appointment_date", `${today}T00:00:00`)
            .lt("appointment_date", `${today}T23:59:59`)
          const { count: unreadCount } = await supabase
            .from("chats")
            .select("*", { count: "exact", head: true })
            .eq("is_read", false)
          const { count: lowStockCount } = await supabase
            .from("inventory")
            .select("*", { count: "exact", head: true })
            .lt("current_stock", "minimum_stock")
          const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
          const { count: consultationsCount } = await supabase
            .from("consultations")
            .select("*", { count: "exact", head: true })
            .gte("consultation_date", firstDayOfMonth)
          const { count: availableBedsCount } = await supabase
            .from("beds")
            .select("*", { count: "exact", head: true })
            .eq("status", "available")
          const { count: occupiedBedsCount } = await supabase
            .from("beds")
            .select("*", { count: "exact", head: true })
            .eq("status", "occupied")
          const newStats = {
            totalPatients: patientsCount || 156,
            totalStaff: staffCount || 24,
            todayAppointments: appointmentsCount || 12,
            unreadMessages: unreadCount || 8,
            lowStockItems: lowStockCount || 5,
            completedConsultations: consultationsCount || 89,
            availableBeds: availableBedsCount || 18,
            occupiedBeds: occupiedBedsCount || 15,
          }
          setStats({
            ...newStats,
            totalPatients: patientsCount || 0,
            totalStaff: staffCount || 0,
            todayAppointments: appointmentsCount || 0,
          })
          saveDashboardStatsOffline(newStats)
          // For charts, you may want to fetch real data; here we just save the mock data
          const newCharts = { monthlyConsultations, bedOccupancy, inventoryStatus }
          setChartData(newCharts)
          saveDashboardChartsOffline(newCharts)
        } catch (error) {
          // fallback to mock data
          setStats({
            totalPatients: 0,
            totalStaff: 0,
            todayAppointments: 0,
            unreadMessages: 0,
            lowStockItems: 0,
            completedConsultations: 0,
            availableBeds: 0,
            occupiedBeds: 0,
          })
          saveDashboardStatsOffline({
            totalPatients: 0,
            totalStaff: 0,
            todayAppointments: 0,
            unreadMessages: 0,
            lowStockItems: 0,
            completedConsultations: 0,
            availableBeds: 0,
            occupiedBeds: 0,
          })
        }
        setLoading(false)
      }
      loadDashboardData()
    } else {
      setLoading(false)
    }
  }, [])

  // Sync unsynced ward details to Supabase
  async function syncWardDetailsToSupabase() {
    if (!userHospitalId) return;
    const wardDetails = loadWardDetailsOffline();
    const data = localStorage.getItem('doctorProfileDetails');
    let unsynced = false;
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.profile && parsed.profile.ward_details && parsed.profile.ward_details_synced === false) {
          unsynced = true;
        }
      } catch (e) {}
    }
    if (wardDetails && unsynced && isOnline()) {
      try {
        const { error } = await supabase
          .from('hospitals')
          .update({ ward_details: wardDetails })
          .eq('id', userHospitalId);
        if (!error) {
          saveWardDetailsOffline(wardDetails, true);
          console.log('[Sync] Ward details synced to Supabase.');
        } else {
          console.error('[Sync] Failed to sync ward details to Supabase:', error);
        }
      } catch (e) {
        console.error('[Sync] Exception syncing ward details:', e);
      }
    }
  }

  // Effect: Sync unsynced ward details when coming online
  useEffect(() => {
    function handleOnline() {
      syncWardDetailsToSupabase();
    }
    window.addEventListener('online', handleOnline);
    // Try to sync immediately if online
    if (isOnline()) {
      syncWardDetailsToSupabase();
    }
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [userHospitalId]);

  // Utility to load ward details from localStorage
  function loadWardDetailsOffline(): Array<{ name: string; rooms: number }> | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('doctorProfileDetails');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          // Prefer ward_details at the root profile (edited locally)
          if (parsed && parsed.profile && Array.isArray(parsed.profile.ward_details) && parsed.profile.ward_details.length > 0) {
            return parsed.profile.ward_details;
          }
          // Fallback to hospitalDetails.ward_details (from login fetch)
          if (parsed && parsed.profile && parsed.profile.hospitalDetails && Array.isArray(parsed.profile.hospitalDetails.ward_details) && parsed.profile.hospitalDetails.ward_details.length > 0) {
            return parsed.profile.hospitalDetails.ward_details;
          }
        } catch (e) {}
      }
    }
    return null;
  }

  // Utility to save ward details to localStorage (with sync flag)
  function saveWardDetailsOffline(wardDetails: Array<{ name: string; rooms: number }>, synced: boolean): void {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('doctorProfileDetails');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.profile) {
            const updatedProfile = { ...parsed.profile, ward_details: wardDetails, ward_details_synced: synced };
            const updatedData = { ...parsed, profile: updatedProfile };
            localStorage.setItem('doctorProfileDetails', JSON.stringify(updatedData));
            console.log('[Offline] Saved ward_details to localStorage (synced:', synced, '):', wardDetails);
          }
        } catch (e) {}
      }
    }
  }

  // Handler functions must be defined before JSX usage
  const handleWardChange = (idx: number, field: string, value: string) => {
    setWards((prev) => prev.map((w, i) => (i === idx ? { ...w, [field]: value } : w)))
  }

  const addWard = () => {
    const last = wards[wards.length - 1]
    if (!last.name || !last.rooms || isNaN(Number(last.rooms)) || !Number.isInteger(Number(last.rooms))) {
      toast({ title: "Please fill in both the ward name and a valid integer for number of rooms before adding another.", variant: "destructive" })
      return
    }
    setWards((prev) => [...prev, { name: "", rooms: "" }])
  }

  const removeWard = (idx: number) => setWards((prev) => prev.filter((_, i) => i !== idx))

  const handleSaveWards = async () => {
    setSavingWards(true)
    try {
      // Validate
      if (!numberOfBeds || isNaN(Number(numberOfBeds)) || !Number.isInteger(Number(numberOfBeds)) || Number(numberOfBeds) <= 0) {
        toast({ title: "Please enter a valid total number of beds.", variant: "destructive" })
        setSavingWards(false)
        return
      }
      if (wards.some(w => !w.name || !w.rooms || isNaN(Number(w.rooms)) || !Number.isInteger(Number(w.rooms)))) {
        toast({ title: "All fields are required and number of rooms must be an integer.", variant: "destructive" })
        setSavingWards(false)
        return
      }
      const wardDetailsToSave = wards.map(w => ({ name: w.name, rooms: Number(w.rooms) }));
      // Always update localStorage profile object
      if (!isOnline()) {
        // Save numberOfBeds and ward_details to hospitalDetails in localStorage
        const profileData = localStorage.getItem('doctorProfileDetails');
        if (profileData) {
          try {
            const parsed = JSON.parse(profileData);
            if (parsed && parsed.profile && parsed.profile.hospitalDetails) {
              parsed.profile.hospitalDetails.number_of_beds = Number(numberOfBeds);
              parsed.profile.hospitalDetails.ward_details = wardDetailsToSave;
              localStorage.setItem('doctorProfileDetails', JSON.stringify(parsed));
            }
          } catch (e) {}
        }
        saveWardDetailsOffline(wardDetailsToSave, false);
        toast({ title: "Saved locally. Will sync to server when online." });
        setSavingWards(false);
        setBedDialogOpen(false);
        return;
      }
      if (!userHospitalId) {
        toast({ title: "No hospital found for this user.", variant: "destructive" });
        setSavingWards(false);
        return;
      }
      // Save to Supabase
      const { error } = await supabase
        .from("hospitals")
        .update({
          ward_details: wardDetailsToSave,
          number_of_beds: Number(numberOfBeds),
        })
        .eq("id", userHospitalId);
      if (error) throw error;
      toast({ title: "Ward details saved!" });
      setBedDialogOpen(false);
      // Update localStorage as synced
      const profileData = localStorage.getItem('doctorProfileDetails');
      if (profileData) {
        try {
          const parsed = JSON.parse(profileData);
          if (parsed && parsed.profile && parsed.profile.hospitalDetails) {
            parsed.profile.hospitalDetails.number_of_beds = Number(numberOfBeds);
            parsed.profile.hospitalDetails.ward_details = wardDetailsToSave;
            localStorage.setItem('doctorProfileDetails', JSON.stringify(parsed));
          }
        } catch (e) {}
      }
      saveWardDetailsOffline(wardDetailsToSave, true);
    } catch (err: any) {
      toast({ title: "Failed to save ward details.", description: err.message, variant: "destructive" })
    } finally {
      setSavingWards(false)
    }
  }

  const handleOpenBedDialog = async () => {
    setWardsLoading(true);
    // Load numberOfBeds from hospitalDetails in localStorage
    let loadedNumberOfBeds = "";
    const profileData = localStorage.getItem('doctorProfileDetails');
    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        if (parsed && parsed.profile && parsed.profile.hospitalDetails && parsed.profile.hospitalDetails.number_of_beds) {
          loadedNumberOfBeds = parsed.profile.hospitalDetails.number_of_beds.toString();
        }
      } catch (e) {}
    }
    setNumberOfBeds(loadedNumberOfBeds);
    // 1. Try localStorage first
    const offlineWards = loadWardDetailsOffline();
    if (offlineWards && Array.isArray(offlineWards) && offlineWards.length > 0) {
      setWards(offlineWards.map((w: any) => ({ name: w.name || "", rooms: w.rooms?.toString() || "" })));
      setWardsLoading(false);
      setBedDialogOpen(true);
      return;
    }
    // 2. If not in localStorage, fetch from Supabase
    if (userHospitalId) {
      const { data, error } = await supabase
        .from("hospitals")
        .select("ward_details")
        .eq("id", userHospitalId)
        .single();
      if (!error && data && Array.isArray(data.ward_details) && data.ward_details.length > 0) {
        setWards(data.ward_details.map((w: any) => ({ name: w.name || "", rooms: w.rooms?.toString() || "" })));
        // Save to localStorage for offline use
        saveWardDetailsOffline(data.ward_details, true);
      } else {
        setWards([{ name: "", rooms: "" }]);
      }
    } else {
      setWards([{ name: "", rooms: "" }]);
    }
    setWardsLoading(false);
    setBedDialogOpen(true);
  }

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    role: '',
    title: '',
  });
  const [staffFormErrors, setStaffFormErrors] = useState<any>({});
  const [staffFormSuccess, setStaffFormSuccess] = useState<string | null>(null);
  const [addingStaff, setAddingStaff] = useState(false);

  const handleAddStaff = async () => {
    setStaffFormErrors({}); setStaffFormSuccess(null);
    // Validation
    const errors: any = {};
    if (!newStaff.full_name) errors.full_name = 'Full name is required.';
    if (!newStaff.email) errors.email = 'Email is required.';
    if (!newStaff.date_of_birth) errors.date_of_birth = 'Date of birth is required.';
    if (!newStaff.address) errors.address = 'Address is required.';
    if (!newStaff.role) errors.role = 'Role is required.';
    if (Object.keys(errors).length) { setStaffFormErrors(errors); return; }

    setAddingStaff(true);
    const password = generateRandomPassword();
    const staffWithHospital: any = { ...newStaff, hospital_id: userHospitalId, role: newStaff.role, title: newStaff.title || undefined };
    const staffForQueue = { ...staffWithHospital, password };

    // Store in localStorage immediately (optional: update staff list)
    // ...

    if (!isOnline()) {
      queueStaffForSync(staffForQueue);
      setStaffFormSuccess('Saved locally. Will sync to server when online.');
      setAddingStaff(false);
      setIsAddStaffOpen(false);
      setNewStaff({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        role: '',
        title: '',
      });
      return;
    }
    try {
      // 1. Sign up staff
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStaff.email,
        password,
        options: { emailRedirectTo: window.location.origin + '/admin' }
      });
      if (authError) throw authError;
      // 2. Insert into users table
      const { error } = await supabase.from('users').insert([{ ...staffWithHospital }]);
      if (error) throw error;
      setStaffFormSuccess('Staff added successfully!');
      setIsAddStaffOpen(false);
      setNewStaff({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        address: '',
        role: '',
        title: '',
      });
      // (Optional) Send password via email (API route)
      console.log(`[ONLINE] Sent password to ${newStaff.email}: ${password}`);
    } catch (err: any) {
      setStaffFormErrors({ general: err.message || 'Failed to add staff.' });
    } finally {
      setAddingStaff(false);
    }
  };

  // Staff dialog open handler
  const handleOpenStaffDialog = async () => {
    setStaffLoading(true);
    setStaffDialogOpen(true);
    let staff: any[] = [];
    // Prefer hospitalDetails.staffs from localStorage profile
    const profileData = localStorage.getItem('doctorProfileDetails');
    if (profileData) {
      try {
        const parsed = JSON.parse(profileData);
        if (parsed && parsed.profile && parsed.profile.hospitalDetails && Array.isArray(parsed.profile.hospitalDetails.staffs) && parsed.profile.hospitalDetails.staffs.length > 0) {
          staff = parsed.profile.hospitalDetails.staffs.filter((s: any) => ["doctor", "staff"].includes(s.role) && s.hospital_id === userHospitalId);
        }
      } catch (e) {}
    }
    // Fallback to localStaff if needed
    if (staff.length === 0) {
      const localStaff = JSON.parse(localStorage.getItem('localStaff') || '[]');
      if (localStaff.length > 0 && userHospitalId) {
        staff = localStaff.filter((s: any) => ["doctor", "staff"].includes(s.role) && s.hospital_id === userHospitalId);
      }
    }
    setStaffList(staff);
    setFilteredStaff(staff);
    // If online, fetch from Supabase
    if (isOnline() && userHospitalId) {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, title, hospital_id")
        .in("role", ["doctor", "staff"])
        .eq("hospital_id", userHospitalId)
        .order("full_name", { ascending: true });
      if (data && !error) {
        staff = data;
        // Save to localStorage for offline use
        localStorage.setItem('localStaff', JSON.stringify(staff));
        // Also save to hospitalDetails.staffs in profile
        const profileData = localStorage.getItem('doctorProfileDetails');
        if (profileData) {
          try {
            const parsed = JSON.parse(profileData);
            if (parsed && parsed.profile && parsed.profile.hospitalDetails) {
              parsed.profile.hospitalDetails.staffs = staff;
              localStorage.setItem('doctorProfileDetails', JSON.stringify(parsed));
            }
          } catch (e) {}
        }
        staff = staff.filter((s: any) => ["doctor", "staff"].includes(s.role) && s.hospital_id === userHospitalId);
        setStaffList(staff);
        setFilteredStaff(staff);
      }
    }
    // Sort alphabetically by full_name
    staff.sort((a, b) => a.full_name.localeCompare(b.full_name));
    setStaffLoading(false);
  };

  // Staff search effect
  useEffect(() => {
    if (!staffSearch) {
      setFilteredStaff(staffList);
    } else {
      const term = staffSearch.toLowerCase();
      setFilteredStaff(
        staffList.filter(
          (s: any) =>
            s.full_name.toLowerCase().includes(term) ||
            (s.title || "").toLowerCase().includes(term) ||
            (s.email || "").toLowerCase().includes(term)
        )
      );
    }
  }, [staffSearch, staffList]);

  if (loading) {
    return (
      <MainLayout>
        {offline && (
          <div className="fixed top-0 left-0 w-full bg-yellow-100 text-yellow-800 text-center py-1 text-xs z-50 shadow">Offline mode: Data may be outdated</div>
        )}
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#021488]"></div>
        </div>
      </MainLayout>
    )
  }

  if (!hasPermission(userRole, ["admin", "doctor"])) {
    return (
      <MainLayout>
        {offline && (
          <div className="fixed top-0 left-0 w-full bg-yellow-100 text-yellow-800 text-center py-1 text-xs z-50 shadow">Offline mode: Data may be outdated</div>
        )}
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  // Update statCards to handle offline message for appointments
  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Registered patients",
    },
    {
      title: "Staff Members",
      value: stats.totalStaff,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Active staff members",
    },
    {
      title: "Today's Appointments",
      value: offline ? null : stats.todayAppointments,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: offline ? "Please go online to see appointments for today" : "Scheduled for today",
    },
    {
      title: "Available Beds",
      value: stats.availableBeds,
      icon: Bed,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: "Ready for patients",
    },
    {
      title: "Occupied Beds",
      value: stats.occupiedBeds,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Currently in use",
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: Package,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Need restocking",
    },
  ]

  return (
    <MainLayout>
      {/* Bed Management Dialog */}
      <Dialog open={bedDialogOpen} onOpenChange={setBedDialogOpen}>
        <DialogContent className="max-w-lg w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-6 shadow-xl">
          {wardsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading ward details...</div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-2xl font-bold text-[#021488] dark:text-[#C5ECF4] mb-2">Configure Wards/Wings</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Add the names of the hospital's wards/wings and specify the number of rooms in each.</p>
              </DialogHeader>
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1">Total Number of Beds in Hospital</label>
                <Input
                  placeholder="Total Number of Beds"
                  type="number"
                  min={1}
                  step={1}
                  value={numberOfBeds}
                  onChange={e => setNumberOfBeds(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-4">
                {wards.map((ward, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                    <Input
                      placeholder="Ward/Wing Name"
                      value={ward.name}
                      onChange={e => handleWardChange(idx, "name", e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Input
                      placeholder="No of rooms"
                      type="number"
                      min={1}
                      step={1}
                      value={ward.rooms}
                      onChange={e => {
                        // Only allow integer values
                        const val = e.target.value
                        if (val === "" || (/^\d+$/.test(val) && Number(val) > 0)) {
                          handleWardChange(idx, "rooms", val)
                        }
                      }}
                      className="w-full sm:w-32"
                      required
                    />
                    {wards.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeWard(idx)} title="Remove ward">
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addWard} className="w-full">+ Add Ward/Wing</Button>
              </div>
              <DialogFooter className="mt-6 flex justify-end gap-2">
                <Button onClick={() => setBedDialogOpen(false)} variant="outline">Cancel</Button>
                <Button onClick={handleSaveWards} disabled={savingWards} className="bg-[#021488] text-white hover:bg-[#1936b7]">Save</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="max-w-lg w-full bg-gray-50 dark:bg-gray-900 rounded-lg p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl font-bold text-[#021488] dark:text-[#C5ECF4] mb-2">Add Staff</DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter staff details below.</p>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name" value={newStaff.full_name} onChange={e => setNewStaff({ ...newStaff, full_name: e.target.value })} required />
            {staffFormErrors.full_name && <div className="text-red-500 text-xs">{staffFormErrors.full_name}</div>}
            <Input placeholder="Email" type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
            {staffFormErrors.email && <div className="text-red-500 text-xs">{staffFormErrors.email}</div>}
            <Input placeholder="Phone" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} />
            <Input placeholder="Date of Birth" type="date" value={newStaff.date_of_birth} onChange={e => setNewStaff({ ...newStaff, date_of_birth: e.target.value })} required />
            {staffFormErrors.date_of_birth && <div className="text-red-500 text-xs">{staffFormErrors.date_of_birth}</div>}
            <Input placeholder="Address" value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} required />
            {staffFormErrors.address && <div className="text-red-500 text-xs">{staffFormErrors.address}</div>}
            <Input placeholder="Title (optional)" value={newStaff.title} onChange={e => setNewStaff({ ...newStaff, title: e.target.value })} />
            <div>
              <label className="block text-xs font-medium mb-1">Role</label>
              <select className="w-full rounded border px-2 py-1" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} required>
                <option value="" disabled>Select role</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
              </select>
              {staffFormErrors.role && <div className="text-red-500 text-xs">{staffFormErrors.role}</div>}
            </div>
            {staffFormErrors.general && <div className="text-red-500 text-xs">{staffFormErrors.general}</div>}
            {staffFormSuccess && <div className="text-green-600 text-xs">{staffFormSuccess}</div>}
          </div>
          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button onClick={() => setIsAddStaffOpen(false)} variant="outline">Cancel</Button>
            <Button onClick={handleAddStaff} disabled={addingStaff} className="bg-[#021488] text-white hover:bg-[#1936b7]">{addingStaff ? 'Adding...' : 'Add Staff'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Staff List Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#021488] dark:text-[#C5ECF4] mb-2">Staff List</DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">All doctors and staff members</p>
          </DialogHeader>
          <div className="mb-4">
            <Input
              placeholder="Search staff by name, title, or email..."
              value={staffSearch}
              onChange={e => setStaffSearch(e.target.value)}
              className="w-full"
            />
          </div>
          {staffLoading ? (
            <div className="text-center py-8 text-gray-500">Loading staff...</div>
          ) : (
            <div className="max-h-96 overflow-y-auto rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
              {filteredStaff.length === 0 ? (
                <div className="text-center text-gray-500 py-8">No staff found.</div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStaff.map((s: any, idx: number) => (
                    <li key={s.id || idx} className="flex items-center justify-between py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                      <div>
                        <div className="font-semibold text-[#021488] dark:text-[#C5ECF4]">{s.full_name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{s.title ? s.title + ' • ' : ''}{s.role.charAt(0).toUpperCase() + s.role.slice(1)}</div>
                      </div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="space-y-4 sm:space-y-6">
        <div className="px-4 sm:px-0">
          <h1 className="text-xl sm:text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Hospital overview and key metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            // Make Staff Members card clickable
            if (stat.title === "Staff Members") {
              return (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleOpenStaffDialog}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-lg sm:text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">{stat.value}</div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            }
            // Other cards are not clickable
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-xs sm:text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="text-lg sm:text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">
                    {stat.title === "Today's Appointments" && offline
                      ? <span className="text-xs text-gray-500">Please go online to see appointments for today</span>
                      : stat.value}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 px-4 sm:px-0">
          {/* Monthly Consultations Chart */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Monthly Consultations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Consultation trends over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    consultations: {
                      label: "Consultations",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[220px] sm:h-[300px] min-w-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.monthlyConsultations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="consultations" stroke="var(--color-consultations)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bed Occupancy Chart */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Bed Occupancy by Ward</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Current bed utilization across wards</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    occupied: {
                      label: "Occupied",
                      color: "hsl(var(--chart-1))",
                    },
                    available: {
                      label: "Available",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[220px] sm:h-[300px] min-w-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.bedOccupancy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ward" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="occupied" fill="var(--color-occupied)" />
                      <Bar dataKey="total" fill="var(--color-available)" opacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Status Chart */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Inventory Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Current stock levels distribution</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="w-full overflow-x-auto">
                <ChartContainer
                  config={{
                    status: {
                      label: "Status",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[220px] sm:h-[300px] min-w-[320px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.inventoryStatus}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {chartData.inventoryStatus.map((entry: { color: string }, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 w-full overflow-x-auto">
                <Card className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={() => setIsAddStaffOpen(true)}>
                  <div className="text-center">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8 text-[#0A91F9] mx-auto mb-2" />
                    <h3 className="font-medium text-sm sm:text-base">Manage Staff</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Add or edit staff</p>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="text-center">
                    <Package className="h-7 w-7 sm:h-8 sm:w-8 text-[#0A91F9] mx-auto mb-2" />
                    <h3 className="font-medium text-sm sm:text-base">Inventory</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Manage supplies</p>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors" onClick={handleOpenBedDialog}>
                  <div className="text-center">
                    <Bed className="h-7 w-7 sm:h-8 sm:w-8 text-[#0A91F9] mx-auto mb-2" />
                    <h3 className="font-medium text-sm sm:text-base">Bed Management</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Manage bed assignments</p>
                  </div>
                </Card>
                <Card className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="text-center">
                    <BarChart3 className="h-7 w-7 sm:h-8 sm:w-8 text-[#0A91F9] mx-auto mb-2" />
                    <h3 className="font-medium text-sm sm:text-base">Reports</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Generate reports</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

// Utility to check online status
function isOnline() { return typeof navigator !== 'undefined' && navigator.onLine; }

// Utility to save/load dashboard stats offline
function saveDashboardStatsOffline(stats: DashboardStats) {
  if (typeof window !== 'undefined') localStorage.setItem('adminDashboardStats', JSON.stringify(stats));
}
function loadDashboardStatsOffline(): DashboardStats | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('adminDashboardStats');
    if (data) return JSON.parse(data) as DashboardStats;
  }
  return null;
}

// Utility to save/load chart data offline
function saveDashboardChartsOffline(charts: { monthlyConsultations: any; bedOccupancy: any; inventoryStatus: any }) {
  if (typeof window !== 'undefined') localStorage.setItem('adminDashboardCharts', JSON.stringify(charts));
}
function loadDashboardChartsOffline(): { monthlyConsultations: any; bedOccupancy: any; inventoryStatus: any } | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('adminDashboardCharts');
    if (data) return JSON.parse(data) as { monthlyConsultations: any; bedOccupancy: any; inventoryStatus: any };
  }
  return null;
}
