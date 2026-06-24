// Mock AI service for demo purposes
export const aiService = {
  async startConsultation(data: any) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      recommendation:
        "Based on your symptoms, I recommend monitoring your condition and staying hydrated. If symptoms persist or worsen, please consult with a healthcare provider.",
      requiresDoctorApproval: true,
      severity: "medium" as const,
    }
  },

  async sendChatMessage(data: any) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const responses = [
      "That's a great question about your health. Here's what I can tell you based on general medical knowledge...",
      "I understand your concern. While I can provide general information, it's always best to consult with a healthcare provider for personalized advice.",
      "Based on what you've described, here are some general recommendations. Remember, this is educational information only.",
      "Thank you for sharing that information. Here's what current medical guidelines suggest...",
    ]

    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      sources: ["Medical Guidelines", "Health Database"],
    }
  },
}

// Keep the types for compatibility
export type ConsultationRequest = {
  userId: string
  symptoms: string
  additionalInfo?: string
}

export type ConsultationResponse = {
  recommendation: string
  requiresDoctorApproval: boolean
  severity: "low" | "medium" | "high"
}

export type ChatRequest = {
  userId: string
  message: string
  chatHistory: any[]
}

export type ChatResponse = {
  message: string
  sources?: string[]
}
