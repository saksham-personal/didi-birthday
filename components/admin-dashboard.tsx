"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MessageCircle, Camera, Heart, Users, Mail, MailOpen } from "lucide-react"

interface PersonalMessage {
  id: number
  sender_name: string
  sender_email: string | null
  message: string
  is_read: boolean
  created_at: string
}

interface Stats {
  messages: { total: number; totalLikes: number }
  memories: { total: number; totalLikes: number }
  personalMessages: { total: number; unread: number }
  activity: { recentMessages: number }
}

export function AdminDashboard() {
  const [personalMessages, setPersonalMessages] = useState<PersonalMessage[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<PersonalMessage | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [messagesRes, statsRes] = await Promise.all([fetch("/api/personal-messages"), fetch("/api/stats")])

      if (messagesRes.ok) {
        const messages = await messagesRes.json()
        setPersonalMessages(messages)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-3xl text-primary">Birthday Dashboard</h1>
          <p className="text-muted-foreground">Overview of all birthday celebration activity</p>
        </div>
        <Button onClick={fetchData} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.messages.total}</p>
                <p className="text-sm text-muted-foreground">Public Messages</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {stats.messages.totalLikes} total likes
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.memories.total}</p>
                <p className="text-sm text-muted-foreground">Memories Shared</p>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3" />
              {stats.memories.totalLikes} total likes
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.personalMessages.total}</p>
                <p className="text-sm text-muted-foreground">Personal Messages</p>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant={stats.personalMessages.unread > 0 ? "default" : "secondary"} className="text-xs">
                {stats.personalMessages.unread} unread
              </Badge>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activity.recentMessages}</p>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Messages in last 24h</div>
          </Card>
        </div>
      )}

      {/* Personal Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Personal Messages</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {personalMessages.map((message) => (
              <Card
                key={message.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{message.sender_name}</p>
                      {!message.is_read && (
                        <Badge variant="default" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatDate(message.created_at)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {message.is_read ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {personalMessages.length === 0 && (
              <Card className="p-8 text-center bg-card">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No personal messages yet</p>
              </Card>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Message Details</h2>
          {selectedMessage ? (
            <Card className="p-6 bg-card">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium text-foreground">{selectedMessage.sender_name}</p>
                  {selectedMessage.sender_email && (
                    <p className="text-sm text-muted-foreground">{selectedMessage.sender_email}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-sm text-foreground">{formatDate(selectedMessage.created_at)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={selectedMessage.is_read ? "secondary" : "default"}>
                    {selectedMessage.is_read ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center bg-card">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
