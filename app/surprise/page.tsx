"use client"

import { Navigation } from "@/components/navigation"
import { SurpriseMessageForm } from "@/components/surprise-message-form"
import { Card } from "@/components/ui/card"
import { Lock, Heart, Gift, Sparkles } from "lucide-react"

export default function SurprisePage() {
  const handleSubmit = async (message: { sender_name: string; message: string; password: string }) => {
    try {
      const response = await fetch("/api/surprise-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Failed to send surprise message:", error)
      }
    } catch (error) {
      console.error("Failed to send surprise message:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SurpriseMessageForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}
