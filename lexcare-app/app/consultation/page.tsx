"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Mic, MicOff, Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { sendConsultMessage } from "@/lib/lexcare-ai"
import { Skeleton } from "@/components/ui/skeleton"

// Add mock AI service at the top of the component
const mockAiService = {
  async startConsultation(data: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      recommendation:
        "Based on your symptoms, I recommend monitoring your condition and staying hydrated. If symptoms persist or worsen, please consult with a healthcare provider.",
      requiresDoctorApproval: true,
      severity: "medium" as const,
    }
  },

  async sendChatMessage(data: any) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      message:
        "Thank you for your question. Based on what you've described, here are some general recommendations. Please remember this is not a substitute for professional medical advice.",
      sources: ["Medical Guidelines", "Health Database"],
    }
  },
}

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date | string
}

export default function Consultation() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [consultationStarted, setConsultationStarted] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionId, setSessionId] = useState<string | undefined>(undefined)
  const [initialLoading, setInitialLoading] = useState(true)

  // Helper function to ensure timestamp is a Date object
  const ensureDate = (timestamp: Date | string): Date => {
    return timestamp instanceof Date ? timestamp : new Date(timestamp)
  }

  // Helper function to format time safely
  const formatTime = (timestamp: Date | string): string => {
    try {
      const date = ensureDate(timestamp)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid time"
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    setInitialLoading(true)
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 5000) // 5 seconds
    return () => clearTimeout(timer)
  }, [user])

  const startConsultation = () => {
    setConsultationStarted(true)
    setMessages([
      {
        id: Date.now().toString(),
        content:
          "Hello! I'm your LexCare AI assistant. Please describe your symptoms or health concerns in detail so I can help you better.",
        isUser: false,
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      // Call LexCare AI consultation API
      const response = await sendConsultMessage(input, sessionId)
      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId)
      }
      let aiContent = ""
      if (response.isComplete) {
        aiContent = `Diagnosis: ${response.diagnosis?.name || "Unknown"} (Confidence: ${response.diagnosis?.confidence != null ? (response.diagnosis.confidence * 100).toFixed(1) : "-"}%)\nAdvice: ${response.advice}`
      } else {
        aiContent = response.nextQuestion || "Please provide more information."
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          content: aiContent,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } catch (error: any) {
      console.error("Error processing message:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process your message. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (isRecording) {
      toast({
        title: "Voice recording stopped",
        description: "Processing your message...",
      })

      setTimeout(() => {
        setInput((prev) => prev + " I have a headache and feel dizzy.")
      }, 1000)
    } else {
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone.",
      })
    }
  }

  // Only render after 5s delay and user check
  if (initialLoading || !user) {
    return (
      <div className="container px-4 py-6 md:py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">AI Consultation</h1>

      {!consultationStarted ? (
        <Card>
          <CardHeader>
            <CardTitle>Start a New Consultation</CardTitle>
            <CardDescription>
              Describe your symptoms to our AI assistant, and we'll provide personalized health recommendations after
              doctor review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>During this consultation, our AI will:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ask about your symptoms and health concerns</li>
              <li>Collect relevant information about your condition</li>
              <li>Generate recommendations based on your input</li>
              <li>Send the report to a doctor for validation</li>
              <li>Notify you when the doctor-approved response is ready</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={startConsultation} className="w-full">
              Start Consultation
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex flex-col h-[76vh]">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                      {/* {!message.isUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )} */}
                      <div className={`rounded-lg p-3 ${message.isUser ? "bg-primary text-white" : "bg-muted"}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                      {/* {message.isUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user?.profile_image || "/placeholder.svg?height=32&width=32"}
                            alt={user?.first_name || "User"}
                          />
                          <AvatarFallback>{user?.first_name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                      )} */}
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">Processing your request...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex w-full items-center gap-2"
              >
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={toggleRecording}
                  className={isRecording ? "text-red-500" : ""}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-h-10 resize-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isProcessing}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
