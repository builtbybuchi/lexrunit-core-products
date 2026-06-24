import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// HMS-integrated types
export type HMSUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  profile_image?: string
  patient_id?: string
  created_at: string
}

export type HMSAppointment = {
  id: string
  user_id: string
  doctor_name: string
  department: string
  date: string
  time: string
  location: string
  notes?: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  created_at: string
}

export type HMSConsultation = {
  id: string
  user_id: string
  status: "pending" | "processing" | "completed"
  symptoms: string
  ai_recommendation?: string
  doctor_approved?: boolean
  doctor_notes?: string
  created_at: string
}

export type HMSChat = {
  id: string
  user_id: string
  title: string
  created_at: string
}

export type HMSChatMessage = {
  id: string
  user_id: string
  chat_id: string
  content: string
  is_ai: boolean
  media_url?: string
  media_type?: "image" | "audio" | "video"
  created_at: string
}

export type HMSDoctor = {
  id: string
  name: string
  specialization: string
  location?: string
  phone?: string
  email: string
}

// HMS-specific functions
export const hmsService = {
  // Get appointments using HMS view
  async getAppointments(userId: string): Promise<HMSAppointment[]> {
    const { data, error } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get consultations using HMS view
  async getConsultations(userId: string): Promise<HMSConsultation[]> {
    const { data, error } = await supabase
      .from("lexcare_consultations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get chats using HMS view
  async getChats(userId: string): Promise<HMSChat[]> {
    const { data, error } = await supabase.from("lexcare_chats").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get chat messages using HMS view
  async getChatMessages(chatId: string): Promise<HMSChatMessage[]> {
    const { data, error } = await supabase
      .from("lexcare_chat_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get available doctors
  async getDoctors(): Promise<HMSDoctor[]> {
    const { data, error } = await supabase.from("lexcare_doctors").select("*").order("name", { ascending: true })

    if (error) throw error
    return data || []
  },

  // Create new chat session
  async createChatSession(title: string): Promise<string> {
    const { data, error } = await supabase.rpc("insert_lexcare_chat_session", {
      title,
    })

    if (error) throw error
    return data
  },

  // Send chat message
  async sendChatMessage(
    sessionId: string,
    content: string,
    isAi = false,
    mediaUrl?: string,
    mediaType?: string,
  ): Promise<string> {
    const { data, error } = await supabase.rpc("insert_lexcare_chat_message", {
      session_uuid: sessionId,
      message_content: content,
      is_ai_message: isAi,
      media_url_param: mediaUrl,
      media_type_param: mediaType,
    })

    if (error) throw error
    return data
  },

  // Book appointment
  async bookAppointment(doctorId: string, appointmentDate: string, notes?: string): Promise<string> {
    const { data, error } = await supabase.rpc("book_lexcare_appointment", {
      doctor_uuid: doctorId,
      appointment_datetime: appointmentDate,
      notes_param: notes,
    })

    if (error) throw error
    return data
  },

  // Submit consultation
  async submitConsultation(symptoms: string, aiRecommendation?: string): Promise<string> {
    const { data, error } = await supabase.rpc("submit_lexcare_consultation", {
      symptoms_param: symptoms,
      ai_recommendation_param: aiRecommendation,
    })

    if (error) throw error
    return data
  },

  // Reschedule appointment
  async rescheduleAppointment(appointmentId: string, newDate: string): Promise<void> {
    const { error } = await supabase.from("appointments").update({ appointment_date: newDate }).eq("id", appointmentId)

    if (error) throw error
  },

  // Cancel appointment
  async cancelAppointment(appointmentId: string): Promise<void> {
    const { error } = await supabase.from("appointments").update({ status: "cancelled" }).eq("id", appointmentId)

    if (error) throw error
  },
}
