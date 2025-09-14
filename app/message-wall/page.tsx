"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { StickyNote } from "@/components/sticky-note"
import { MessageForm } from "@/components/message-form"
import { MessageModal } from "@/components/message-modal"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface Message {
  id: string
  text: string
  author: string
  title?: string // Added title field to interface
  timestamp: Date
  likes: number
  color: "pink" | "blue" | "yellow" | "green" | "purple" | "orange" | "teal" | "rose"
}

export default function MessageWallPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/messages")
      if (response.ok) {
        const data = await response.json()
        const formattedMessages = data.map((message: any) => ({
          ...message,
          timestamp: new Date(message.created_at),
        }))
        setMessages(formattedMessages)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleNewMessage = async (messageData: { text: string; author: string; title: string; color: string }) => {
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      })
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error("Failed to submit message:", error)
    }
  }

  const handleLike = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg)))
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-black text-4xl md:text-6xl text-primary mb-4">Message Wall</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share your birthday wishes, memories, and love for Dr. Prakshi. Each message is a special gift!
            </p>

            <div className="flex justify-center mt-6">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh Messages
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Message Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Leave a Message</h2>
                <MessageForm onSubmit={handleNewMessage} />
              </div>
            </div>

            {/* Messages Grid */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-2">
                  Birthday Messages ({messages.length})
                </h2>
                <p className="text-muted-foreground">Messages by loved ones</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map((message) => (
                  <StickyNote
                    key={message.id}
                    id={message.id}
                    message={message.text}
                    author={message.author}
                    title={message.title} // Pass title prop
                    timestamp={message.timestamp}
                    likes={message.likes}
                    color={message.color}
                    onClick={() => setSelectedMessage(message)} // Added click handler
                  />
                ))}
              </div>

              {messages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No messages yet. Be the first to wish Dr. Prakshi a happy birthday!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedMessage && (
        <MessageModal message={selectedMessage} onClose={() => setSelectedMessage(null)} onLike={handleLike} />
      )}
    </div>
  )
}