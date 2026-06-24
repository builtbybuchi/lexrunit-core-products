"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MapPin, Calendar, MessageCircle, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, type User, fetchDoctorProfileDetails } from "@/lib/auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Consultation {
  id: string
  consultation_date: string
  patient_name: string
  diagnosis: string
  status: string
}

interface Chat {
  id: string
  sender_name: string
  message: string
  created_at: string
  is_read: boolean
}

// Utility to check online status
function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Utility to save and load from localStorage
const STORAGE_KEY = 'doctorProfileDetails';
function saveProfileDetailsOffline(data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[Offline] Saved profile details to localStorage:', data);
  }
}
function loadProfileDetailsOffline() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      console.log('[Offline] Loaded profile details from localStorage:', parsed);
      // If it's a full profileData object, return as is
      if (parsed && parsed.profile) {
        return parsed;
      }
      // If it's just a user object, wrap it
      if (parsed && parsed.id && parsed.full_name) {
        console.log('[Offline] Detected user object, wrapping as profileData.');
        return { profile: parsed };
      }
    }
  }
  return null;
}

// Utility to load offline profile details (sync)
function getInitialProfileData() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.profile) return parsed;
      if (parsed && parsed.id && parsed.full_name) return { profile: parsed };
    }
  }
  return null;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<any>(() => getInitialProfileData());
  const [loading, setLoading] = useState(() => getInitialProfileData() ? false : true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState(() => {
    const initial = getInitialProfileData();
    if (initial && initial.profile) {
      return {
        full_name: initial.profile.full_name || '',
        title: initial.profile.title || '',
        phone: initial.profile.phone || '',
        location: initial.profile.location || '',
      };
    }
    return { full_name: '', title: '', phone: '', location: '' };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect 2: If online, fetch from Supabase in the background and update state/cache
  useEffect(() => {
    async function refreshOnline() {
      if (isOnline()) {
        const data = await fetchDoctorProfileDetails();
        if (data) {
          setProfileData(data);
          saveProfileDetailsOffline(data);
          setEditForm({
            full_name: data.profile.full_name || '',
            title: data.profile.title || '',
            phone: data.profile.phone || '',
            location: data.profile.location || '',
          });
        }
      }
    }
    refreshOnline();
  }, []);

  // Offline authentication: allow access if doctor profile exists in storage
  useEffect(() => {
    if (!isOnline() && !profileData) {
      const offlineData = loadProfileDetailsOffline();
      console.log('[Offline] Fallback: Attempting to load profile details from localStorage...');
      if (offlineData) {
        setProfileData(offlineData);
        setLoading(false);
      } else {
        console.log('[Offline] No profile details found in localStorage (fallback).');
      }
    }
  }, [profileData]);

  // Debug logging before rendering
  console.log('[ProfilePage] profileData:', profileData);
  if (profileData) {
    console.log('[ProfilePage] profileData.profile:', profileData.profile);
  } else {
    console.warn('[ProfilePage] profileData is null or undefined');
  }
  if (profileData && !profileData.profile) {
    console.warn('[ProfilePage] profileData.profile is missing');
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#021488]" />
        </div>
      </MainLayout>
    );
  }

  if (!profileData || !profileData.profile) {
    return (
      <MainLayout>
        <div className="text-center">User not found</div>
      </MainLayout>
    );
  }

  const { profile, consultations, chats, patients } = profileData;
  const unreadChats = chats?.filter((chat: any) => !chat.is_read).length || 0;

  // Handle save profile
  const handleSaveProfile = async () => {
    setSaving(true);
    setError(null);
    if (!isOnline()) {
      setError('You must be online to update your profile.');
      setSaving(false);
      return;
    }
    try {
      const { error } = await supabase.from('users').update(editForm).eq('id', profile.id);
      if (error) {
        setError('Failed to update profile.');
      } else {
        // Update local state and offline cache
        const newProfile = { ...profile, ...editForm };
        const newProfileData = { ...profileData, profile: newProfile };
        setProfileData(newProfileData);
        saveProfileDetailsOffline(newProfileData);
        setIsEditDialogOpen(false);
      }
    } catch (e) {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  return (
    <MainLayout hospitalDetails={profile.hospitalDetails}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || profile.profile_image || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#021488] text-white text-lg">
                {profile.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-[#021488] dark:text-[#C5ECF4]">{profile.full_name}</h1>
              <p className="text-[#0546B6] dark:text-[#0A91F9]">{profile.title}</p>
              <Badge variant="secondary" className="mt-1">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            </div>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#021488] hover:bg-[#0546B6]">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your profile information.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={editForm.full_name}
                    onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={editForm.location}
                    onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder={profile.location || profile.address || ''}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} className="bg-[#021488] hover:bg-[#0546B6]" disabled={saving || !isOnline()}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-[#0A91F9]" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              {(profile.location || profile.address) && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile.location || profile.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Consultations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-[#0A91F9]" />
                <span>Recent Consultations</span>
              </CardTitle>
              <CardDescription>{consultations?.length || 0} recent consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultations && consultations.length > 0 ? (
                  consultations.map((consultation: any) => (
                    <div
                      key={consultation.id}
                      className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{consultation.patient_name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{consultation.diagnosis}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(consultation.consultation_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {consultation.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No consultations by you yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Chats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-[#0A91F9]" />
                <span>Pending Chats</span>
                {unreadChats > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadChats}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{chats?.length || 0} recent messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chats && chats.length > 0 ? (
                  chats.map((chat: any) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg ${
                        !chat.is_read ? "bg-[#C5ECF4] dark:bg-[#0546B6]" : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm">{chat.sender_name}</p>
                        {!chat.is_read && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {chat.message.length > 50 ? `${chat.message.substring(0, 50)}...` : chat.message}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent messages</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients List (optional, you can render as needed) */}
        {/* <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Patients in Your Hospital</h2>
          <ul>
            {patients && patients.length > 0 ? (
              patients.map((patient: any) => (
                <li key={patient.id}>{patient.full_name} ({patient.email})</li>
              ))
            ) : (
              <li>No patients found.</li>
            )}
          </ul>
        </div> */}
      </div>
    </MainLayout>
  );
}
