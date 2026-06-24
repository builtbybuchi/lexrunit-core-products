"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Store, Search, Phone, Mail, MapPin, Plus, CreditCard, User, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, hasPermission } from "@/lib/auth"

interface Merchant {
  id: string
  name: string
  sells: string
  account_number: string
  address: string
  phone: string
  email: string
  contact_person: string
  payment_terms: string
  status: string
  created_at: string
}

// Mock data for development
const mockMerchants: Merchant[] = [
  {
    id: "1",
    name: "MedSupply Co.",
    sells: "Surgical Tools, Medical Equipment",
    account_number: "1234567890",
    address: "123 Health St, Lagos, Nigeria",
    phone: "+234 801 234 5678",
    email: "sales@medsupply.ng",
    contact_person: "John Adebayo",
    payment_terms: "30 days",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "PharmaPlus",
    sells: "Medications, Pharmaceuticals",
    account_number: "0987654321",
    address: "456 Cure Ave, Abuja, Nigeria",
    phone: "+234 802 345 6789",
    email: "orders@pharmaplus.ng",
    contact_person: "Sarah Okafor",
    payment_terms: "15 days",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "HealthTech Solutions",
    sells: "Medical Devices, Monitoring Equipment",
    account_number: "1122334455",
    address: "789 Tech Boulevard, Port Harcourt, Nigeria",
    phone: "+234 803 456 7890",
    email: "info@healthtech.ng",
    contact_person: "Michael Eze",
    payment_terms: "45 days",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Global Medical Supplies",
    sells: "Laboratory Equipment, Consumables",
    account_number: "5566778899",
    address: "321 Medical Plaza, Kano, Nigeria",
    phone: "+234 804 567 8901",
    email: "procurement@globalmed.ng",
    contact_person: "Fatima Hassan",
    payment_terms: "30 days",
    status: "inactive",
    created_at: "2024-01-01T00:00:00Z",
  },
]

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMerchant, setNewMerchant] = useState({
    name: "",
    sells: "",
    account_number: "",
    address: "",
    phone: "",
    email: "",
    contact_person: "",
    payment_terms: "",
  })

  useEffect(() => {
    const loadMerchants = async () => {
      const user = await getCurrentUser()
      if (!user) return

      setUserRole(user.role)

      // Check if user has admin permission
      if (!hasPermission(user.role, ["admin"])) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("merchants").select("*").order("name", { ascending: true })

        if (data && !error) {
          setMerchants(data)
          setFilteredMerchants(data)
        } else {
          setMerchants(mockMerchants)
          setFilteredMerchants(mockMerchants)
        }
      } catch (error) {
        console.log("Database not available, using mock data")
        setMerchants(mockMerchants)
        setFilteredMerchants(mockMerchants)
      }

      setLoading(false)
    }

    loadMerchants()
  }, [])

  useEffect(() => {
    const filtered = merchants.filter((merchant) => {
      const matchesSearch =
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.sells.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.contact_person.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || merchant.status === statusFilter

      return matchesSearch && matchesStatus
    })

    setFilteredMerchants(filtered)
  }, [searchTerm, statusFilter, merchants])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddMerchant = async () => {
    try {
      const { data, error } = await supabase.from("merchants").insert([newMerchant]).select()

      if (data && !error) {
        setMerchants([...merchants, data[0]])
        setIsAddDialogOpen(false)
        setNewMerchant({
          name: "",
          sells: "",
          account_number: "",
          address: "",
          phone: "",
          email: "",
          contact_person: "",
          payment_terms: "",
        })
      }
    } catch (error) {
      console.error("Error adding merchant:", error)
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
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have permission to access merchant management.</p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  const activeMerchants = merchants.filter((merchant) => merchant.status === "active").length
  const inactiveMerchants = merchants.filter((merchant) => merchant.status === "inactive").length

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">Merchants</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage suppliers and vendor relationships</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">
                <Plus className="h-4 w-4 mr-2" />
                Add Merchant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Merchant</DialogTitle>
                <DialogDescription>Enter the merchant details to add them to your supplier network.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Merchant Name</label>
                  <Input
                    value={newMerchant.name}
                    onChange={(e) => setNewMerchant({ ...newMerchant, name: e.target.value })}
                    placeholder="Enter merchant name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Person</label>
                  <Input
                    value={newMerchant.contact_person}
                    onChange={(e) => setNewMerchant({ ...newMerchant, contact_person: e.target.value })}
                    placeholder="Enter contact person"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={newMerchant.phone}
                    onChange={(e) => setNewMerchant({ ...newMerchant, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={newMerchant.email}
                    onChange={(e) => setNewMerchant({ ...newMerchant, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    value={newMerchant.account_number}
                    onChange={(e) => setNewMerchant({ ...newMerchant, account_number: e.target.value })}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Terms</label>
                  <Input
                    value={newMerchant.payment_terms}
                    onChange={(e) => setNewMerchant({ ...newMerchant, payment_terms: e.target.value })}
                    placeholder="e.g., 30 days"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Products/Services</label>
                  <Input
                    value={newMerchant.sells}
                    onChange={(e) => setNewMerchant({ ...newMerchant, sells: e.target.value })}
                    placeholder="What does this merchant sell?"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    value={newMerchant.address}
                    onChange={(e) => setNewMerchant({ ...newMerchant, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMerchant} className="bg-[#021488] hover:bg-[#0546B6]">
                  Add Merchant
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Merchants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">{merchants.length}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Registered suppliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeMerchants}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{inactiveMerchants}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Not currently active</p>
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
                  placeholder="Search merchants by name, products, or contact person..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Merchants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMerchants.map((merchant) => (
            <Card key={merchant.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{merchant.name}</CardTitle>
                  <Badge className={getStatusColor(merchant.status)}>
                    {merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{merchant.sells}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-[#0A91F9]" />
                  <span>{merchant.contact_person}</span>
                </div>

                {merchant.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-[#0A91F9]" />
                    <span>{merchant.phone}</span>
                  </div>
                )}

                {merchant.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-[#0A91F9]" />
                    <span>{merchant.email}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-[#0A91F9]" />
                  <span className="truncate">{merchant.address}</span>
                </div>

                {merchant.account_number && (
                  <div className="flex items-center space-x-2 text-sm">
                    <CreditCard className="h-4 w-4 text-[#0A91F9]" />
                    <span>Account: {merchant.account_number}</span>
                  </div>
                )}

                <div className="text-sm">
                  <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Payment Terms</p>
                  <p className="text-gray-600 dark:text-gray-400">{merchant.payment_terms}</p>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-[#0A91F9]" />
                  <span>Added: {new Date(merchant.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Create Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMerchants.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {searchTerm || statusFilter !== "all" ? "No merchants found" : "No merchants registered"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start by adding your first merchant."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button className="bg-[#021488] hover:bg-[#0546B6]" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Merchant
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
