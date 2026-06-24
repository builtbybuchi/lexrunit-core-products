import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  full_name: string
  role: "doctor" | "admin" | "staff"
  title?: string
  phone?: string
  location?: string
  avatar_url?: string
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("Sign in error:", error)
    return { data: null, error: { message: "Authentication service unavailable" } }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: { message: "Sign out failed" } }
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userData, error } = await supabase.from("users").select("*").eq("email", user.email).single()

    if (error || !userData) {
      // Return a mock user for development if database is not set up
      return null
    }

    return userData as User
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export const hasPermission = (userRole: string, requiredRoles: string[]) => {
  return requiredRoles.includes(userRole)
}

// Fetches the current doctor's profile, recent consultations, pending chats, and hospital patients
export const fetchDoctorProfileDetails = async () => {
  try {
    // 1. Get current user (doctor)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("No current user found");
      return null;
    }

    // 2. Fetch recent consultations for the doctor
    const { data: consultationsData, error: consultationsError } = await supabase
      .from("consultations")
      .select(`
        id,
        consultation_date,
        diagnosis,
        patients(full_name)
      `)
      .eq("doctor_id", currentUser.id)
      .order("consultation_date", { ascending: false })
      .limit(5);

    const consultations = (consultationsData || []).map((c: any) => ({
      id: c.id,
      consultation_date: c.consultation_date,
      patient_name: c.patients?.full_name || "Unknown Patient",
      diagnosis: c.diagnosis || "No diagnosis",
      status: c.status,
    }));

    // 3. Fetch pending chats for the doctor
    const { data: chatsData, error: chatsError } = await supabase
      .from("chats")
      .select(`
        id,
        message,
        created_at,
        is_read,
        sender:sender_id(full_name)
      `)
      .eq("receiver_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(5);

    const chats = (chatsData || []).map((c: any) => ({
      id: c.id,
      sender_name: c.sender?.full_name || "Unknown Sender",
      message: c.message,
      created_at: c.created_at,
      is_read: c.is_read,
    }));

    // 4. Fetch all patients with the same hospital_id as the doctor
    const { data: patientsData, error: patientsError } = await supabase
      .from("users")
      .select("id, full_name, email, phone, hospital_id, role")
      .eq("role", "patients")
      .eq("hospital_id", (currentUser as any).hospital_id);

    const patients = (patientsData || []).map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      hospital_id: p.hospital_id,
      role: p.role,
    }));

    // 5. Fetch hospital details from hospitals table
    let hospitalDetails = null;
    if ((currentUser as any).hospital_id) {
      const { data: hospitalData, error: hospitalError } = await supabase
        .from("hospitals")
        .select("hospital_name, city, state, ward_details")
        .eq("id", (currentUser as any).hospital_id)
        .single();
      if (hospitalData) {
        hospitalDetails = hospitalData;
      }
    }

    // Attach hospitalDetails to the profile object
    const profileWithHospital = { ...currentUser, hospitalDetails };

    const result = {
      profile: profileWithHospital,
      consultations,
      chats,
      patients,
    };

    console.log("Doctor Profile Details:", result);
    return result;
  } catch (error) {
    console.error("Error fetching doctor profile details:", error);
    return null;
  }
};
