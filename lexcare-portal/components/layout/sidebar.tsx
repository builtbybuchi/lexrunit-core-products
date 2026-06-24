"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  User,
  Calendar,
  Stethoscope,
  MessageCircle,
  Users,
  BarChart3,
  Package,
  UserCog,
  Bed,
  Store,
  Moon,
  Sun,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface SidebarProps {
  userRole: string
}

const menuItems = [
  { icon: User, label: "Profile", href: "/profile", roles: ["doctor", "admin", "staff"] },
  { icon: Calendar, label: "Schedule", href: "/schedule", roles: ["doctor", "admin", "staff"] },
  { icon: Stethoscope, label: "Consultation", href: "/consultation", roles: ["doctor", "admin"] },
  { icon: MessageCircle, label: "Chats", href: "/chats", roles: ["doctor", "admin", "staff"] },
  { icon: Users, label: "Patients", href: "/patients", roles: ["doctor", "admin", "staff"] },
  { icon: Bed, label: "Bed Management", href: "/beds", roles: ["doctor", "admin"] },
  { icon: BarChart3, label: "Admin Dashboard", href: "/admin", roles: ["admin", "doctor"] },
  { icon: Package, label: "Inventory", href: "/inventory", roles: ["admin"] },
  { icon: Store, label: "Merchants", href: "/merchants", roles: ["admin"] },
  { icon: UserCog, label: "Staff Management", href: "/staff", roles: ["admin"] },
]

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 bg-[#021488] text-white h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#0546B6]">
        <h1 className="text-xl font-bold text-[#C5ECF4]">LexCare</h1>
        <p className="text-sm text-[#0A91F9]">Hospital Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive ? "bg-[#0546B6] text-[#C5ECF4]" : "text-white hover:bg-[#0546B6] hover:text-[#C5ECF4]"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#0546B6] space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full justify-start text-white hover:bg-[#0546B6] hover:text-[#C5ECF4]"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="ml-2">Toggle Theme</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-white hover:bg-red-600"
        >
          <LogOut size={16} />
          <span className="ml-2">Sign Out</span>
        </Button>
      </div>
    </div>
  )
}
