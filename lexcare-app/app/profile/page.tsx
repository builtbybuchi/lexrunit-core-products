//Profile

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { userProfileService, vitalSignsService, storageService } from "@/lib/appwrite-service"
import { Camera, Edit, Save, Settings, X } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { Calendar } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // adjust import if needed
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [gender, setGender] = useState("")
  const [address, setAddress] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [allergies, setAllergies] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!user && !loading) {
      const timeoutId = setTimeout(() => {
        setShowLoginPrompt(true);
      }, 5000);
      return () => clearTimeout(timeoutId);
    } else {
      setShowLoginPrompt(false);
    }
  }, [user, loading]);

  // Fetch profile from users table
  const fetchProfile = async () => {
    if (!user) return
    try {
      // Fetch user profile from Appwrite
      const data = await userProfileService.getByUserId(user.id)
      
      if (data) {
        setProfile(data)
        setFirstName(data.first_name || data.full_name?.split(" ")[0] || "")
        setLastName(data.last_name || data.full_name?.split(" ").slice(1).join(" ") || "")
        setGender(data.gender || "")
        setAddress(data.address || "")
        setEmergencyContact(data.emergency_contact_name || "")
        setEmergencyPhone(data.emergency_contact_phone || "")
        setAllergies(data.allergies || "")
        setDateOfBirth(data.date_of_birth || "")
        setPhone(data.phone || "")
        setPreviewUrl(data.profile_image || null)
      } else {
        // Create profile if it doesn't exist
        const newProfile = await userProfileService.create(user.id, {
          email: user.email,
          full_name: user.full_name || user.email?.split("@")[0] || "User",
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
        })
        setProfile(newProfile)
        setFirstName(newProfile.first_name || "")
        setLastName(newProfile.last_name || "")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  useEffect(() => {
    fetchProfile()
    // eslint-disable-next-line
  }, [user])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setError("")
    setLoading(true)

    try {
      let profileImageUrl = profile?.profile_image

      // Upload profile image if selected
      if (profileImage) {
        try {
          const { url } = await storageService.uploadProfileImage(user.id, profileImage)
          profileImageUrl = url
        } catch (uploadError) {
          console.error("Error uploading profile image:", uploadError)
          throw uploadError
        }
      }

      // Update profile
      await userProfileService.update(profile.$id, {
        full_name: [firstName, lastName].filter(Boolean).join(" "),
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth || undefined,
        phone: phone || undefined,
        gender: gender || undefined,
        address: address || undefined,
        emergency_contact_name: emergencyContact || undefined,
        emergency_contact_phone: emergencyPhone || undefined,
        allergies: allergies || undefined,
        profile_image: profileImageUrl,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      setIsEditing(false)
      setProfileImage(null)

      // Refetch profile to get latest data
      await fetchProfile()
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
      console.error("Save profile error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFirstName(profile?.full_name?.split(" ")[0] || "")
    setLastName(profile?.full_name?.split(" ").slice(1).join(" ") || "")
    setPhone(profile?.phone || "")
    setDateOfBirth(profile?.date_of_birth || "")
    setAddress(profile?.address || "")
    setGender(profile?.gender || "")
    setProfileImage(null)
    setPreviewUrl(profile?.profile_image || null)
    setError("")
  }



  console.log(profile)

  return (
    <div className="container px-4 py-6 md:py-8">

      {profile ? (
        <div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Profile
              </CardTitle>
              <Link href="/settings">
                <Button variant="ghost" className="p-0">
                  <Settings style={{ width: 24, height: 24 }} />
                </Button>
              </Link>
            </div>
          </CardHeader>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={previewUrl || profile?.profile_image || "/placeholder.svg?height=80&width=80"}
                        alt={profile?.full_name || ""}
                      />
                      <AvatarFallback className="text-lg">
                        {firstName?.[0]}
                        {lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div>
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                          <Camera className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageSelect}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile?.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support if needed.</p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={!isEditing}
                          className={`flex items-center w-full px-3 py-2 border rounded-md bg-background ${!isEditing ? "opacity-70 cursor-not-allowed" : "hover:bg-muted"}`}
                          onClick={() => isEditing && setShowDatePicker(true)}
                        >
                          <span className="flex-1 text-left">
                            {dateOfBirth
                              ? new Date(dateOfBirth).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                              : "Select Date of Birth"}
                          </span>
                          <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DayPicker
                          mode="single"
                          selected={dateOfBirth ? new Date(dateOfBirth) : undefined}
                          onSelect={date => {
                            setDateOfBirth(
                              date
                                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                                : ""
                            )
                            setShowDatePicker(false)
                          }}
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          captionLayout="dropdown"
                          showOutsideDays
                          required
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      disabled={!isEditing}
                      className="w-full border rounded-md px-3 py-2 bg-background"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Your address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={emergencyContact}
                      onChange={e => setEmergencyContact(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      value={allergies}
                      onChange={e => setAllergies(e.target.value)}
                      disabled={!isEditing}
                      placeholder="List any allergies"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <Input value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ""} disabled className="bg-muted" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <div className="flex gap-2 w-full">
                    <Button onClick={handleSave} disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} disabled={loading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>Your LexCare activity summary.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Total Consultations</p>
                      <p className="text-sm text-muted-foreground">AI consultations completed</p>
                    </div>
                    <div className="text-2xl font-bold text-primary">{profile?.total_consultations ?? 0}</div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Appointments</p>
                      <p className="text-sm text-muted-foreground">Scheduled appointments</p>
                    </div>
                    <div className="text-2xl font-bold text-secondary">{profile?.number_of_appointments ?? 0}</div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Health Records</p>
                      <p className="text-sm text-muted-foreground">Medical records stored</p>
                    </div>
                    <div className="text-2xl font-bold text-tertiary">{profile?.number_of_health_records ?? 0}</div>
                  </div>

                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Vital Signs</p>
                      <p className="text-sm text-muted-foreground">Measurements recorded</p>
                    </div>
                    <div className="text-2xl font-bold text-accent-foreground">{profile?.number_of_vital_signs ?? 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>) : (
        showLoginPrompt && !user ? (
          <div>
            <p>Please login to view your profile.</p>
            <Link href="/login">
              <Button variant="ghost" className="bg-blue-500 hover:bg-blue-600 text-white">
                Login
              </Button>
            </Link>
          </div>
        ) : (
          <div className="animate-pulse">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </div>
            </CardHeader>
            <div className="p-4">
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-300 rounded mb-4"></div>
            </div>
          </div>
        )


      )}
    </div>
  )
}
