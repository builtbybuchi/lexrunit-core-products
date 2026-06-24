"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { userProfileService } from "@/lib/appwrite-service"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Mic, MicOff, Send, ImageIcon, Phone, PlusCircle, X, Menu, Pencil, SquarePen, Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Http } from '@capacitor-community/http';

import watermark from "@public/watermark.png"


// Add mock AI service
const mockAiService = {
  async sendChatMessage(data: any) {
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

type Message = {
  id: string
  content: string
  isUser: boolean
  timestamp: Date | string
  mediaUrl?: string
  mediaType?: "image" | "audio" | "video"
}

type Chat = {
  id: string
  title: string
  lastMessage: string
  timestamp: Date | string
}

export default function Chat() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<{ profile_image?: string; full_name?: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  // Remove global isProcessing; we'll track pending AI responses per message
  const [aiThinking, setAiThinking] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isCallingAI, setIsCallingAI] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);


  //console.log(user)

  // Fetch user profile from Appwrite when user is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        const data = await userProfileService.getByUserId(user.id);
        if (data) {
          setUserProfile({
            profile_image: data.profile_image,
            full_name: data.full_name,
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      }
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load chats
  useEffect(() => {
    if (user) {
      loadChats()
    }
  }, [user])

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat)
    }
  }, [selectedChat])

  const loadChats = async () => {
    if (!user) return

    try {
      // Mock implementation
      const storedChats = localStorage.getItem("chats")
      const parsedChats = storedChats ? JSON.parse(storedChats) : []

      if (parsedChats.length > 0) {
        // Ensure timestamps are Date objects
        const formattedChats = parsedChats.map((chat: any) => ({
          ...chat,
          timestamp: ensureDate(chat.timestamp),
        }))
        setChats(formattedChats)
        setSelectedChat(formattedChats[0].id)
      } else {
        createNewChat("General Health")
      }
    } catch (error) {
      console.error("Error loading chats:", error)
      createNewChat("General Health")
    }
  }

  const loadMessages = async (chatId: string) => {
    if (!user) return

    setMessagesLoading(true)
    // Reset AI thinking state when loading a new chat
    setAiThinking(false)
    console.log('[loadMessages] aiThinking set to false for chat', chatId)

    try {
      // Mock implementation
      const storedMessages = localStorage.getItem(`chat_${chatId}`)
      const parsedMessages = storedMessages ? JSON.parse(storedMessages) : []

      if (parsedMessages.length > 0) {
        // Ensure timestamps are Date objects
        const formattedMessages = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: ensureDate(msg.timestamp),
        }))
        setMessages(formattedMessages)
        // If last message is from user, allow sending a new message
        if (formattedMessages[formattedMessages.length - 1]?.isUser) {
          setAiThinking(false)
          console.log('[loadMessages] aiThinking set to false (last message is user) for chat', chatId)
        }
      } else {
        setMessages([])
        // No initial message
        localStorage.setItem(`chat_${chatId}`, JSON.stringify([]))
      }
    } catch (error) {
      console.error("Error loading messages:", error)
      setAiThinking(false)
      console.log('[loadMessages] aiThinking set to false (initial message) for chat', chatId)
    } finally {
      setMessagesLoading(false)
    }
  }

  const createNewChat = async (title: string) => {
    if (!user) return

    setMessagesLoading(true)
    try {
      // Mock implementation
      const newChat = {
        id: Date.now().toString(),
        title: title,
        lastMessage: "New conversation",
        timestamp: new Date(),
      }

      const updatedChats = [newChat, ...chats]
      setChats(updatedChats)
      setSelectedChat(newChat.id)

      // Save to local storage
      localStorage.setItem("chats", JSON.stringify(updatedChats))
      localStorage.setItem(`chat_${newChat.id}`, JSON.stringify([]))
    } catch (error) {
      console.error("Error creating new chat:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create a new chat.",
      })
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleSendMessage = async () => {
    console.log("Sending message now")
    if ((!input.trim() && !selectedFile) || !user || !selectedChat) return

    let mediaUrl = ""
    let mediaType = undefined

    // Handle file upload if present
    if (selectedFile) {
      try {
        // Determine media type
        if (selectedFile.type.startsWith("image/")) {
          mediaType = "image"
        } else if (selectedFile.type.startsWith("audio/")) {
          mediaType = "audio"
        } else if (selectedFile.type.startsWith("video/")) {
          mediaType = "video"
        }

        mediaUrl = "mock_url"
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload file.",
        })
        return
      }
    }

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim() || (selectedFile ? `Sent a ${mediaType}` : ""),
      isUser: true,
      timestamp: new Date(),
      mediaUrl,
      mediaType: mediaType as "image" | "audio" | "video" | undefined,
    }

    setInput("")
    setSelectedFile(null)
    setAiThinking(true)
    console.log('[handleSendMessage] aiThinking set to true for chat', selectedChat)

    // Add user message immediately
    setMessages((prev) => {
      const updated = [...prev, userMessage]
      localStorage.setItem(`chat_${selectedChat}`, JSON.stringify(updated))
      return updated
    })

    try {

      const response = await fetch('https://ai.lexrunit.com/chat/patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'LEXRUNIT-API-KEY': process.env.NEXT_PUBLIC_LEXRUNIT_API_KEY!
        },
        body: JSON.stringify({
          message: input,
          session_id: selectedChat,
          user_id: user.id
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.response) {
        throw new Error('No response from AI service')
      }

      // Create AI response message
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => {
        const updated = [...prev, aiMessage]
        localStorage.setItem(`chat_${selectedChat}`, JSON.stringify(updated))
        return updated
      })

    } catch (error) {
      console.error("Error processing message:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your message. Please try again.",
      })
    } finally {
      setAiThinking(false)
      console.log('[handleSendMessage] aiThinking set to false for chat', selectedChat)
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
        setInput((prev) => prev + " Can you tell me about common cold remedies?")
      }, 1000)
    } else {
      toast({
        title: "Voice recording started",
        description: "Speak clearly into your microphone.",
      })
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      toast({
        title: "File selected",
        description: `${e.target.files[0].name} ready to send.`,
      })
    }
  }

  const startAICall = () => {
    setIsCallingAI(true)
    toast({
      title: "Calling AI Assistant",
      description: "Connecting to voice call...",
    })

    setTimeout(() => {
      toast({
        title: "Call Connected",
        description: "You can now speak with the AI assistant.",
      })
    }, 2000)
  }

  const endAICall = () => {
    setIsCallingAI(false)
    toast({
      title: "Call Ended",
      description: "Your call with the AI assistant has ended.",
    })
  }

  const handleCreateNewChat = () => {
    if (newChatTitle.trim()) {
      createNewChat(newChatTitle)
      setNewChatTitle("")
      setIsNewChatDialogOpen(false)
    }
  }

  function getGreeting(name: string) {
    const hour = new Date().getHours();
    let greeting = "Good morning";
    if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon";
    } else if (hour >= 18 || hour < 4) {
      greeting = "Good evening";
    }
    return `${greeting}, ${name}`;
  }
  const firstName = userProfile?.full_name?.split(" ")[0] || user?.full_name?.split(" ")[0] || user?.first_name || user?.email?.split("@")[0] || "there";

  // Add a handler to delete a chat
  const handleDeleteChat = (chatId: string) => {
    // Remove chat from chats array
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    // Remove chat messages from localStorage
    localStorage.removeItem(`chat_${chatId}`);
    localStorage.setItem("chats", JSON.stringify(updatedChats));
    // If the deleted chat is selected, clear selection and messages
    if (selectedChat === chatId) {
      setSelectedChat(updatedChats.length > 0 ? updatedChats[0].id : null);
      setMessages([]);
    }
  };

  if (initialLoading) {
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
    );
  }

  return (
    <div className="container min-h-[75vh] h-[75vh] px-4 py-6 md:py-8 relative">
      {/* Custom Watermark */}

      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        <img
          src="/watermark.png"
          alt="Watermark"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-auto object-contain"
          style={{ maxWidth: "90vw" }}
        />
      </div>

      {/* Mobile Hamburger and Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <div className="bg-white w-72 max-w-full h-full shadow-lg p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg">Your Chats</span>
              <button
                aria-label="Close sidebar"
                className="text-2xl"
                onClick={() => setMobileSidebarOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${selectedChat === chat.id ? "bg-primary text-white" : "hover:bg-accent"}`}
                  onClick={() => {
                    setMessagesLoading(true);
                    setSelectedChat(chat.id);
                    setMobileSidebarOpen(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{chat.title}</div>
                    <div className="text-xs opacity-70 truncate">{chat.lastMessage}</div>
                  </div>
                  {chat.title !== 'General Health' && (
                    <button
                      className="ml-2 p-1 rounded hover:bg-red-100 text-red-600"
                      aria-label="Delete chat"
                      onClick={e => {
                        e.stopPropagation();
                        setChatToDelete(chat);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                setIsNewChatDialogOpen(true);
                setMobileSidebarOpen(false);
              }}
            >
              New Chat
            </Button>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}
      <div className="flex items-center justify-between mb-0 w-full gap-2">
        <div className="flex items-center">
          <button
            className="md:hidden mr-3"
            aria-label="Open chat sidebar"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <h1 className="text-2xl text-center">LexCare AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="hover:bg-accent rounded-full p-2"
            onClick={() => setIsNewChatDialogOpen(true)}
            aria-label="New Chat"
          >
            <SquarePen className="h-5 w-5" />
          </button>
          <button
            className="hover:bg-accent rounded-full p-2"
            onClick={isCallingAI ? endAICall : startAICall}
            aria-label="Call AI"
          >
            <Phone className="h-5 w-5" color="#22c55e" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Chat List - Hidden on mobile */}
        <div className="hidden md:block">
          <div className="h-[70vh] border border-background rounded-lg bg-background p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="text-lg font-bold">Your Chats</span>
              <button
                className="hover:bg-accent rounded-full p-2"
                onClick={() => setIsNewChatDialogOpen(true)}
                aria-label="New Chat"
              >
                <Pencil className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto h-[calc(70vh-4rem)]">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${selectedChat === chat.id ? "bg-primary text-white" : "hover:bg-accent"}`}
                    onClick={() => {
                      setMessagesLoading(true);
                      setSelectedChat(chat.id);
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{chat.title}</div>
                      <div className="text-xs opacity-70 truncate">{chat.lastMessage}</div>
                    </div>
                    {chat.title !== 'General Health' && (
                      <button
                        className="ml-2 p-1 rounded hover:bg-red-100 text-red-600"
                        aria-label="Delete chat"
                        onClick={e => {
                          e.stopPropagation();
                          setChatToDelete(chat);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="md:col-span-3">
          <div className="flex flex-col h-[78vh] border border-background rounded-lg bg-background">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4 h-full">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xl text-muted-foreground font-semibold">
                      {getGreeting(firstName)}
                    </span>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-start gap-2 max-w-[80%] ${message.isUser ? "flex-row-reverse" : ""}`}>
                        <div className={`rounded-lg p-3 ${message.isUser ? "bg-blue-100 text-blue-900" : "bg-primary text-white"}`}>
                          {message.mediaUrl && message.mediaType === "image" && (
                            <div className="mb-2">
                              <img
                                src={message.mediaUrl || "/placeholder.svg"}
                                alt="Shared image"
                                className="rounded-md max-w-full max-h-60 object-contain"
                              />
                            </div>
                          )}
                          {message.mediaUrl && message.mediaType === "audio" && (
                            <div className="mb-2">
                              <audio src={message.mediaUrl} controls className="w-full" />
                            </div>
                          )}
                          {message.mediaUrl && message.mediaType === "video" && (
                            <div className="mb-2">
                              <video
                                src={message.mediaUrl}
                                controls
                                className="rounded-md max-w-full max-h-60 object-contain"
                              />
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {/* Show loader for the last message if it is from user and has no AI response yet */}
                {aiThinking && messages.length > 0 && messages[messages.length - 1].isUser && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <div className="rounded-lg p-3 bg-primary text-white">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <p className="text-sm">Evaluating your request...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="border-t p-4 relative">
              {selectedFile && (
                <div className="absolute bottom-20 left-8 right-8 bg-background border rounded-md p-2 flex justify-between items-center">
                  <span className="text-sm truncate">{selectedFile.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="relative w-full"
              >
                <div className="flex items-end w-full relative">
                  {/* File upload button bottom left */}
                  <button
                    type="button"
                    className="absolute left-2 bottom-2 z-10 p-1 rounded hover:bg-accent"
                    onClick={handleFileSelect}
                    aria-label="Upload File"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,audio/*,video/*"
                      className="hidden"
                    />
                  </button>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 min-h-10 max-h-40 pr-20 pl-10 resize-none rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ overflow: 'auto' }}
                    rows={1}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  {/* Record and Send icons bottom right */}
                  <div className="absolute right-8 bottom-2 flex items-center gap-1 z-10">
                    <button
                      type="button"
                      className={`p-1 rounded ${isRecording ? "text-red-500" : "hover:bg-accent"}`}
                      onClick={toggleRecording}
                      aria-label="Record"
                    >
                      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      type="submit"
                      className="p-1 rounded hover:bg-accent"
                      disabled={aiThinking || messagesLoading || (!input.trim() && !selectedFile)}
                      aria-label="Send"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {/* {aiThinking && (
                  <span style={{ color: 'orange', fontSize: 12, marginLeft: 8 }}>
                    [aiThinking: true]
                  </span>
                )} */}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
            <DialogDescription>Give your chat a title to help you find it later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chatTitle">Chat Title</Label>
              <Input
                id="chatTitle"
                placeholder="e.g., Nutrition Advice"
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateNewChat}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the chat{chatToDelete ? ` "${chatToDelete.title}"` : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (chatToDelete) handleDeleteChat(chatToDelete.id);
                setDeleteDialogOpen(false);
                setChatToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
