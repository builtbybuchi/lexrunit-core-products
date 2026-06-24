"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { notificationsService } from "@/lib/appwrite-service"
import { Bell, Check, Calendar, MessageSquare, CreditCard, AlertCircle } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  type: "appointment" | "consultation" | "payment" | "alert" | "general"
  is_read: boolean
  created_at: string
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>("newest")
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadNotifications()
    }
  }, [user])

  const loadNotifications = async () => {
    if (!user) return

    try {
      const data = await notificationsService.getByUserId(user.id)
      
      if (data) {
        // Convert Appwrite documents to Notification type
        const formattedData = data.map(item => ({
          id: item.$id,
          title: item.title,
          message: item.message,
          type: item.type || "general",
          is_read: item.is_read || false,
          created_at: item.$createdAt,
        }))
        setNotifications(formattedData as Notification[])
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notifications.",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    if (!user) return

    try {
      await notificationsService.markAsRead(id)

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification.",
      })
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await notificationsService.markAllAsRead(user.id)

      setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })))

      toast({
        title: "Success",
        description: "All notifications marked as read.",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notifications.",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5" />
      case "consultation":
        return <MessageSquare className="h-5 w-5" />
      case "payment":
        return <CreditCard className="h-5 w-5" />
      case "alert":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
      case "consultation":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      case "payment":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
      case "alert":
        return "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const sortNotifications = (notifications: Notification[]) => {
    const sorted = [...notifications]

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      case "oldest":
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case "unread":
        return sorted.sort((a, b) => {
          if (a.is_read === b.is_read) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          }
          return a.is_read ? 1 : -1
        })
      default:
        return sorted
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="container px-4 py-6 md:py-8">
      {/* Header at the very top */}
      <div className="mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Controls below header */}
      <div className="flex items-center gap-2 mb-6">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="unread">Unread first</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {sortNotifications(notifications).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.is_read ? "bg-background" : "bg-accent/20"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleDateString()} at{" "}
                            {new Date(notification.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6"
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
              <p className="mt-4 text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
