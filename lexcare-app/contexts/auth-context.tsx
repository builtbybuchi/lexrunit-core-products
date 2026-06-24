"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { account, ID } from "@/lib/appwrite"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import type { Models } from "appwrite"
import { userProfileService } from "@/lib/appwrite-service"

type User = {
  id: string
  email: string
  full_name: string
  first_name: string
  last_name: string
  phone?: string
  profile_image?: string
  role?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("Checking Appwrite session...")
        const appwriteUser = await account.get()
        
        console.log("Appwrite user found:", appwriteUser.$id)
        
        // Map Appwrite user to our User type
        const [firstName, ...lastNameParts] = (appwriteUser.name || appwriteUser.email?.split("@")[0] || "User").split(" ")
        const userRecord: User = {
          id: appwriteUser.$id,
          email: appwriteUser.email,
          full_name: appwriteUser.name || appwriteUser.email?.split("@")[0] || "User",
          first_name: firstName,
          last_name: lastNameParts.join(" ") || "",
          phone: appwriteUser.phone || undefined,
          profile_image: undefined,
          role: "patients"
        }
        
        setUser(userRecord)
      } catch (error) {
        console.log("No active Appwrite session")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password)
      
      // Get user details after successful login
      const appwriteUser = await account.get()
      const [firstName, ...lastNameParts] = (appwriteUser.name || appwriteUser.email?.split("@")[0] || "User").split(" ")
      
      const userRecord: User = {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        full_name: appwriteUser.name || appwriteUser.email?.split("@")[0] || "User",
        first_name: firstName,
        last_name: lastNameParts.join(" ") || "",
        phone: appwriteUser.phone || undefined,
        profile_image: undefined,
        role: "patients"
      }
      
      setUser(userRecord)
      router.push("/")
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone?: string) => {
    try {
      const fullName = `${firstName} ${lastName}`.trim()
      
      // Create account in Appwrite
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        fullName
      )
      
      // Create session to update phone and create profile
      await account.createEmailPasswordSession(email, password)
      
      // Update phone if provided
      if (phone) {
        try {
          // Format phone number with + if not already present
          const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
          await account.updatePhone(formattedPhone, password)
        } catch (phoneError) {
          console.error("Error updating phone:", phoneError)
        }
      }
      
      // Create user profile in users collection
      try {
        await userProfileService.create(newAccount.$id, {
          email: email,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          phone: phone ? (phone.startsWith('+') ? phone : `+${phone}`) : undefined,
          role: 'patients'
        })
      } catch (profileError) {
        console.error("Error creating user profile:", profileError)
      }
      
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      })

      router.push("/login")
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await account.deleteSession('current')
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      )
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
