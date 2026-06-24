"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCog, Search, Mail, Phone, MapPin, Plus, Calendar, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, hasPermission } from "@/lib/auth"

interface StaffMember {
  id: string
  email: string
  full_name: string
  role: string
  title: string
  phone: string
  location: string
  avatar_url: string
  created_at: string
}

interface StaffShift {
  id: string
  staff_id: string
  shift_date: string
  start_time: string
  end_time: string
  status: string
}

// Mock data for development
const mockStaff: StaffMember[] = [
  {
    id: "1",
    email: "dr.benson@lexcare.com",
    full_name: "Dr. Benson Okwu",
    role: "doctor",
    title: "Senior Physician",
    phone: "+234 123 456 7890",
    location: "Enugu State, Nigeria",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "admin@lexcare.com",
    full_name: "Sarah Johnson",
    role: "admin",
    title: "Hospital Administrator",
    phone: "+234 123 456 7891",
    location: "Ngorongoro, Tanzania",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "nurse.mary@lexcare.com",
    full_name: "Mary Chukwu",
    role: "staff",
    title: "Senior Nurse",
    phone: "+234 123 456 7892",
    location: "Enugu State, Nigeria",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "dr.smith@lexcare.com",
    full_name: "Dr. John Smith",
    role: "doctor",
    title: "Cardiologist",
    phone: "+234 123 456 7893",
    location: "Lagos, Nigeria",
    avatar_url: "",
    created_at: "2024-01-01T00:00:00Z",
  },
]

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const loadStaff = async () => {
      const user = await getCurrentUser()
      if (!user) return

      setUserRole(user.role)

      // Check if user has admin permission
      if (!hasPermission(user.role, ["admin"])) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

        if (data && !error) {
          setStaff(data)
          setFilteredStaff(data)
        } else {
          setStaff(mockStaff)
          setFilteredStaff(mockStaff)
        }
      } catch (error) {
        console.log("Database not available, using mock data")
        setStaff(mockStaff)
        setFilteredStaff(mockStaff)
      }

      setLoading(false)
    }

    loadStaff()
  }, [])

  useEffect(() => {
    const filtered = staff.filter((member) => {
      const matchesSearch =
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.title?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || member.role === roleFilter

      return matchesSearch && matchesRole
    })
    setFilteredStaff(filtered)
  }, [searchTerm, roleFilter, staff])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "staff":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  if (!hasPermission(userRole, ["admin"])) {
    return (
      <MainLayout>
        <Card>
          <CardContent className="text-center py-12">
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have permission to access staff management.</p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  const doctorsCount = staff.filter((member) => member.role === "doctor").length
  const staffCount = staff.filter((member) => member.role === "staff").length
  const adminsCount = staff.filter((member) => member.role === "admin").length

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Staff Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage hospital staff, roles, and schedules</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-[#021488] text-[#021488] hover:bg-[#021488] hover:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Manage Shifts
            </Button>
            <Button className="bg-[#021488] hover:bg-[#0546B6]">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">{staff.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">All staff members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{doctorsCount}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Medical doctors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Nursing Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{staffCount}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nurses & support staff</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{adminsCount}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Admin staff</p>
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
                  placeholder="Search staff by name, email, or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="staff">Nursing Staff</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#021488] text-white">
                      {member.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.full_name}</CardTitle>
                    <CardDescription>{member.title}</CardDescription>
                  </div>
                  <Badge className={getRoleColor(member.role)}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-[#0A91F9]" />
                  <span>{member.email}</span>
                </div>

                {member.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-[#0A91F9]" />
                    <span>{member.phone}</span>
                  </div>
                )}

                {member.location && (
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#0A91F9]" />
                    <span>{member.location}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#0A91F9]" />
                  <span>Joined: {new Date(member.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Manage Shifts
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || roleFilter !== "all" ? "No staff found" : "No staff members"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || roleFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first staff member."}
              </p>
              {!searchTerm && roleFilter === "all" && (
                <Button className="bg-[#021488] hover:bg-[#0546B6]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Staff Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
