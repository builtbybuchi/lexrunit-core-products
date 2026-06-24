"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, AlertTriangle, Plus, TrendingDown, ShoppingCart, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface InventoryItem {
  id: string
  item_name: string
  category: string
  current_stock: number
  minimum_stock: number
  reorder_level: number
  unit_price: number
  cost_per_unit: number
  supplier: string
  expiry_date: string
  last_restocked: string
  created_at: string
}

interface CartItem extends InventoryItem {
  quantity: number
  price: number
}

interface OrderItem {
  id: string;
  item_name: string;
  quantity: number;
  price: number;
  supplier: string;
}

const CATEGORY_GROUPS = [
  "🩺 Medical Categories",
  "🧪 Lab and Diagnostic Categories",
  "🛠 Medical Equipment Categories",
  "🚑 Operational & Support Items",
  "📦 Administrative & Facility Supplies",
  "🍽 Catering & Accommodation",
  "🔋 Utility & Infrastructure"
];

// Mock data for development
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    item_name: "Paracetamol 500mg",
    category: "Medication",
    current_stock: 150,
    minimum_stock: 50,
    reorder_level: 70,
    unit_price: 0.5,
    cost_per_unit: 0.4,
    supplier: "PharmaCorp Ltd",
    expiry_date: "2025-06-15",
    last_restocked: "2024-01-05",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    item_name: "Surgical Gloves",
    category: "Medical Supplies",
    current_stock: 25,
    minimum_stock: 100,
    reorder_level: 150,
    unit_price: 2.0,
    cost_per_unit: 1.8,
    supplier: "MedSupply Inc",
    expiry_date: "",
    last_restocked: "2024-01-10",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    item_name: "Blood Pressure Monitor",
    category: "Equipment",
    current_stock: 5,
    minimum_stock: 2,
    reorder_level: 4,
    unit_price: 150.0,
    cost_per_unit: 120.0,
    supplier: "MedTech Solutions",
    expiry_date: "",
    last_restocked: "2023-12-20",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    item_name: "Bandages",
    category: "Medical Supplies",
    current_stock: 0,
    minimum_stock: 25,
    reorder_level: 50,
    unit_price: 1.5,
    cost_per_unit: 1.2,
    supplier: "HealthCare Supplies",
    expiry_date: "2026-03-20",
    last_restocked: "2023-11-15",
    created_at: "2024-01-01T00:00:00Z",
  },
]

export default function InventoryPage() {
  // User and loading states
  const [userRole, setUserRole] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Inventory & filters
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Dialog states
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Item states
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)
  const [newStockValue, setNewStockValue] = useState(0)

  // Reorder logic
  const [reorderItems, setReorderItems] = useState<InventoryItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: number }>({})
  const [priceInputs, setPriceInputs] = useState<{ [key: string]: number }>({})

  //Submit order logic
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  
  // Add item form
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    current_stock: 0,
    minimum_stock: 0,
    reorder_level: 0,
    unit_price: 0,
    cost_per_unit: 0,
    supplier: "",
    expiry_date: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    const loadInventory = async () => {
      const user = await getCurrentUser()
      if (!user) return

      setUserRole(user.role)

      // Check if user has admin permission
      if (!hasPermission(user.role, ["admin"])) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("inventory").select("*").order("item_name", { ascending: true })

        if (data && !error) {
          const formattedInventory = data.map((item) => ({
            id: item.id,
            item_name: item.item_name,
            category: item.category || "Uncategorized",
            current_stock: item.current_stock || 0,
            minimum_stock: item.minimum_stock || 0,
            reorder_level: item.reorder_level || item.minimum_stock + 20,
            unit_price: item.unit_price || 0,
            cost_per_unit: item.cost_per_unit || item.unit_price * 0.8,
            supplier: item.supplier || "Unknown",
            expiry_date: item.expiry_date || "",
            last_restocked: item.last_restocked || "",
            created_at: item.created_at,
          }))
          setInventory(formattedInventory)
          setFilteredInventory(formattedInventory)
        } else {
          setInventory(mockInventory)
          setFilteredInventory(mockInventory)
        }
      } catch (error) {
        console.log("Database not available, using mock data")
        setInventory(mockInventory)
        setFilteredInventory(mockInventory)
      }

      setLoading(false)
    }

    loadInventory()
  }, [])

  useEffect(() => {
    const filtered = inventory.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      let matchesStock = true
      if (stockFilter === "low") {
        matchesStock = item.current_stock <= item.minimum_stock
      } else if (stockFilter === "out") {
        matchesStock = item.current_stock === 0
      } else if (stockFilter === "reorder") {
        matchesStock = item.current_stock <= item.reorder_level
      }

      return matchesSearch && matchesCategory && matchesStock
    })

    setFilteredInventory(filtered)
  }, [searchTerm, categoryFilter, stockFilter, inventory])

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) {
      return { status: "Out of Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    } else if (item.current_stock <= item.minimum_stock) {
      return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800", icon: TrendingDown }
    } else if (item.current_stock <= item.reorder_level) {
      return { status: "Reorder Soon", color: "bg-orange-100 text-orange-800", icon: ShoppingCart }
    } else {
      return { status: "In Stock", color: "bg-green-100 text-green-800", icon: Package }
    }
  }

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return expiry <= thirtyDaysFromNow
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return
    const { error } = await supabase.from("inventory").delete().eq("id", itemToDelete.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete item",
        description: error.message,
      })
    } else {
      toast({ title: "Item deleted successfully" })
      setInventory((prev) => prev.filter((item) => item.id !== itemToDelete.id))
      setFilteredInventory((prev) => prev.filter((item) => item.id !== itemToDelete.id))
      setItemToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleReorderItem = async (item: InventoryItem) => {
    const restockedAmount = 50 // or prompt/input this value in future

    const { data, error } = await supabase
      .from("inventory")
      .update({
        current_stock: item.current_stock + restockedAmount,
        last_restocked: new Date().toISOString(),
      })
      .eq("id", item.id)
      .select()

    if (error) {
      toast({
        variant: "destructive",
        title: "Reorder failed",
        description: error.message,
      })
      return
    }

    // Update local state
    const updatedItem = {
      ...item,
      current_stock: item.current_stock + restockedAmount,
      last_restocked: new Date().toISOString(),
    }

    setInventory((prev) =>
      prev.map((invItem) => (invItem.id === item.id ? updatedItem : invItem))
    )
    setFilteredInventory((prev) =>
      prev.map((invItem) => (invItem.id === item.id ? updatedItem : invItem))
    )

    toast({
      title: "Reorder Successful",
      description: `${item.item_name} restocked by ${restockedAmount} units.`,
    })
  }

     //handle order submission
  const handleSubmitOrder = async () => {
  if (cart.length === 0) return;

  setIsSubmittingOrder(true);
  
  try {
    // 1. Create the order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        status: 'pending',
        total_amount: cart.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        ordered_by: (await getCurrentUser())?.id,
      }])
      .select()
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    // 2. Add all order items
    const orderItems = cart.map(item => ({
      order_id: orderData.id,
      inventory_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      supplier: item.supplier,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    // 3. Show success and clear cart
    toast({
      title: "Order Submitted Successfully",
      description: `Order #${orderData.id} has been sent to suppliers.`,
    });
    
    setCart([]);
    setReorderDialogOpen(false);
    setQuantityInputs({});
    setPriceInputs({});

  } catch (error: unknown) {
    let errorMessage = "Failed to submit order";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast({
      variant: "destructive",
      title: "Order Submission Failed",
      description: errorMessage,
    });
  } finally {
    setIsSubmittingOrder(false);
  }
};

  const handleUpdateStock = async () => {
    if (!itemToEdit) return

    const { error } = await supabase
      .from("inventory")
      .update({
        current_stock: newStockValue,
        last_restocked: new Date().toISOString(),
      })
      .eq("id", itemToEdit.id)

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to update stock",
        description: error.message,
      })
    } else {
      toast({ title: "Stock updated successfully" })

      setInventory((prev) =>
        prev.map((i) =>
          i.id === itemToEdit.id
            ? { ...i, current_stock: newStockValue, last_restocked: new Date().toISOString() }
            : i
        )
      )
      setFilteredInventory((prev) =>
        prev.map((i) =>
          i.id === itemToEdit.id
            ? { ...i, current_stock: newStockValue, last_restocked: new Date().toISOString() }
            : i
        )
      )
      setEditDialogOpen(false)
      setItemToEdit(null)
    }
  }

      const handleBatchReorder = () => {
      // Filter items where current stock is at or below reorder level
      const itemsNeedingReorder = inventory.filter(item => 
        item.current_stock <= item.reorder_level
      );
      
      setReorderItems(itemsNeedingReorder);
      setReorderDialogOpen(true);
      
      // Debug log (optional)
      console.log('Items needing reorder:', itemsNeedingReorder.map(i => i.item_name));
    };

    const handleAddToCart = (item: InventoryItem) => {
    const quantity = quantityInputs[item.id] || 0
    const price = priceInputs[item.id] || 0
    if (!quantity || !price) return

    const existing = cart.find(i => i.id === item.id)
    const newItem = { ...item, quantity, price }

    if (existing) {
      setCart(cart.map(i => i.id === item.id ? newItem : i))
    } else {
      setCart([...cart, newItem])
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
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have permission to access inventory management.
            </p>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  const lowStockItems = inventory.filter((item) => item.current_stock <= item.minimum_stock)
  const outOfStockItems = inventory.filter((item) => item.current_stock === 0)
  const categories = [...new Set(inventory.map((item) => item.category))]
  const totalValue = inventory.reduce((sum, item) => sum + item.current_stock * item.unit_price, 0)

  return (
  <MainLayout>
    <div className="space-y-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#021488]">Inventory Management</h1>
          <div className="flex gap-2">
            <Button
              onClick={handleBatchReorder}
              variant="outline"
              className="border-[#021488] text-[#021488] hover:bg-[#021488] hover:text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Reorder Items
            </Button>

            {/* Add Item Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#021488] hover:bg-[#0546B6]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-[#021488]">Add New Inventory Item</DialogTitle>
                  <p className="text-sm text-gray-500">Fill in all required fields to add a new item</p>
                </DialogHeader>

                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();

                    const { data, error } = await supabase
                      .from("inventory")
                      .insert([
                        {
                          ...formData,
                          last_restocked: new Date().toISOString(),
                          expiry_date: formData.expiry_date || null,
                        },
                      ])
                      .select();

                    if (error) {
                      toast({
                        variant: "destructive",
                        title: "Error adding item",
                        description: error.message,
                      });
                    } else {
                      toast({
                        title: "Item added successfully",
                        description: `${formData.item_name} has been added to inventory.`,
                      });

                      setInventory((prev) => [...prev, ...(data || [])]);
                      setFilteredInventory((prev) => [...prev, ...(data || [])]);
                      setOpen(false);
                      setFormData({
                        item_name: "",
                        category: "",
                        current_stock: 0,
                        minimum_stock: 0,
                        reorder_level: 0,
                        unit_price: 0,
                        cost_per_unit: 0,
                        supplier: "",
                        expiry_date: "",
                      });
                    }
                  }}
                >
                  {[
                    { label: "Item Name", key: "item_name", type: "text" },
                    { 
                      label: "Category", 
                      key: "category", 
                      type: "select",
                      options: [
                        "🩺 Medical Categories",
                        "🧪 Lab and Diagnostic Categories",
                        "🛠 Medical Equipment Categories",
                        "🚑 Operational & Support Items",
                        "📦 Administrative & Facility Supplies",
                        "🍽 Catering & Accommodation",
                        "🔋 Utility & Infrastructure"
                      ]
                    },
                    { label: "Supplier", key: "supplier", type: "text" },
                    { label: "Current Stock", key: "current_stock", type: "number" },
                    { label: "Minimum Stock", key: "minimum_stock", type: "number" },
                    { label: "Reorder Level", key: "reorder_level", type: "number" },
                    { label: "Unit Price", key: "unit_price", type: "number" },
                    { label: "Cost Per Unit", key: "cost_per_unit", type: "number" },
                    { label: "Expiry Date", key: "expiry_date", type: "date" },
                  ].map(({ label, key, type, options }) => (
                    <div key={key} className="space-y-1">
                      <Label className="text-[#021488]">{label}</Label>
                      {type === "select" ? (
                        <Select
                          value={formData[key as keyof typeof formData] as string}
                          onValueChange={(value) => 
                            setFormData(prev => ({...prev, [key]: value}))
                          }
                        >
                          <SelectTrigger className="w-full border-[#021488]/30 focus:border-[#021488] focus:ring-[#021488]">
                            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <input
                          required={key !== "expiry_date"}
                          type={type}
                          value={formData[key as keyof typeof formData] ?? ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              [key]: type === "number" ? Number(e.target.value) : e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-[#021488]/30 rounded-md focus:border-[#021488] focus:ring-[#021488]"
                        />
                      )}
                    </div>
                  ))}

                  <div className="md:col-span-2 flex justify-end space-x-2 pt-4 border-t border-[#021488]/20">
                    <Button 
                      variant="outline" 
                      type="button"
                      className="border-[#021488] text-[#021488] hover:bg-[#021488] hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-[#021488] hover:bg-[#0546B6]"
                    >
                      Add Item
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">{inventory.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Items in inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current stock value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Items need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{outOfStockItems.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Items out of stock</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Reorder Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{reorderItems.length}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Items to reorder</p>
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
                    placeholder="Search inventory by name, category, or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORY_GROUPS.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock Levels</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                    <SelectItem value="reorder">Reorder Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 🛒 Reorder Popup Dialog */}
          <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
  <DialogContent className="max-w-4xl">
    <DialogHeader>
      <DialogTitle className="text-[#021488]">
        Reorder Items ({reorderItems.length})
      </DialogTitle>
      <p className="text-sm text-gray-500">
        {reorderItems.length > 0 
          ? "These items need immediate restocking"
          : "All inventory levels are adequate"}
      </p>
    </DialogHeader>

    {reorderItems.length === 0 ? (
      <div className="text-center py-6">
        <Package className="h-10 w-10 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No items currently require reordering</p>
      </div>
    ) : (
      <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
        {reorderItems.map(item => {
          const quantityNeeded = Math.max(
            item.reorder_level - item.current_stock, 
            1  // Always reorder at least 1 unit
          );
          
          return (
            <div 
              key={item.id} 
              className="border border-[#021488]/20 p-4 rounded-md shadow-sm"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-medium text-[#021488]">{item.item_name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Current:</span> {item.current_stock} | 
                    <span className="font-medium"> Min:</span> {item.minimum_stock} | 
                    <span className="font-medium"> Reorder At:</span> {item.reorder_level}
                  </div>
                  <div className="text-sm text-[#021488] mt-1">
                    <span className="font-medium">Supplier:</span> {item.supplier}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs block mb-1">Quantity Needed</Label>
                    <Input
                      type="number"
                      min={quantityNeeded}
                      defaultValue={quantityNeeded}
                      className="border-[#021488]/50"
                      onChange={(e) => setQuantityInputs(prev => ({
                        ...prev,
                        [item.id]: Math.max(parseInt(e.target.value) || 0, quantityNeeded)
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs block mb-1">Unit Price ($)</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={item.cost_per_unit.toFixed(2)}
                      className="border-[#021488]/50"
                      onChange={(e) => setPriceInputs(prev => ({
                        ...prev,
                        [item.id]: parseFloat(e.target.value) || item.cost_per_unit
                      }))}
                    />
                  </div>
                  
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#021488] hover:bg-[#0546B6] h-10 mt-auto"
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}

    {cart.length > 0 && (
      <div className="mt-6 border-t border-[#021488]/20 pt-4">
        <h3 className="font-semibold text-lg text-[#021488] mb-3">🛒 Order Summary</h3>
        <div className="space-y-2 mb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm text-gray-500">{item.supplier}</p>
              </div>
              <div className="text-right">
                <p>{item.quantity} × ${item.price.toFixed(2)}</p>
                <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold text-[#021488]">
            ${cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
          </span>
        </div>
      </div>
    )}

    <DialogFooter className="mt-4">
      <Button 
        variant="outline"
        className="border-[#021488] text-[#021488] hover:bg-[#021488] hover:text-white"
        onClick={() => {
          setReorderDialogOpen(false);
          setCart([]);
        }}
      >
        {cart.length > 0 ? 'Cancel Order' : 'Close'}
      </Button>
      
      {cart.length > 0 && (
        <Button 
          className="bg-[#021488] hover:bg-[#0546B6]"
          onClick={handleSubmitOrder}
          disabled={isSubmittingOrder}
        >
          {isSubmittingOrder ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Submit Purchase Order'
          )}
        </Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>
          
          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item)
              const StatusIcon = stockStatus.icon
              const expiringSoon = isExpiringSoon(item.expiry_date)

              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.item_name}</CardTitle>
                      <div className="flex flex-col gap-1">
                        <Badge className={stockStatus.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {stockStatus.status}
                        </Badge>
                        {expiringSoon && (
                          <Badge variant="destructive" className="text-xs">
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>{item.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Current</p>
                        <p className="text-lg font-bold">{item.current_stock}</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Min</p>
                        <p className="text-lg">{item.minimum_stock}</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Reorder</p>
                        <p className="text-lg">{item.reorder_level}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Unit Price</p>
                        <p>${item.unit_price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Total Value</p>
                        <p>${(item.current_stock * item.unit_price).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Supplier</p>
                      <p>{item.supplier}</p>
                    </div>

                    {item.expiry_date && (
                      <div className="text-sm">
                        <p className="font-medium text-[#021488] dark:text-[#C5ECF4]">Expiry Date</p>
                        <div className="flex items-center space-x-2">
                          <p>{new Date(item.expiry_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {item.last_restocked && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-[#0A91F9]" />
                        <span>Last restocked: {new Date(item.last_restocked).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Dialog open={editDialogOpen && itemToEdit?.id === item.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditDialogOpen(false)
                            setItemToEdit(null)
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setItemToEdit(item)
                                setNewStockValue(item.current_stock)
                                setEditDialogOpen(true)
                              }}
                            >
                              Update Stock
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Stock for {item.item_name}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                              <Label>New Stock Quantity</Label>
                              <Input
                                type="number"
                                value={newStockValue}
                                onChange={(e) => setNewStockValue(Number(e.target.value))}
                                className="w-full"
                              />

                              <div className="flex justify-end space-x-2 pt-2">
                                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleUpdateStock}>Confirm</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => handleReorderItem(item)}
                      >
                        Reorder
                      </Button>

                      {/* Delete Dialog */}
                      <Dialog
                        open={deleteDialogOpen && itemToDelete?.id === item.id}
                        onOpenChange={(open) => {
                          if (!open) {
                            setDeleteDialogOpen(false)
                            setItemToDelete(null)
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => {
                              setDeleteDialogOpen(true)
                              setItemToDelete(item)
                            }}
                          >
                            Delete
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Item</DialogTitle>
                          </DialogHeader>

                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete <strong>{item.item_name}</strong>? This action cannot be undone.
                          </p>

                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteItem}>
                              Confirm
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredInventory.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                    ? "No items found"
                    : "No inventory items"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || categoryFilter !== "all" || stockFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by adding your first inventory item."}
                </p>
                {!searchTerm && categoryFilter === "all" && stockFilter === "all" && (
                  <Button className="bg-[#021488] hover:bg-[#0546B6]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}