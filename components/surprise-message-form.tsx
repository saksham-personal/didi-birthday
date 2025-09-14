"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import { SurpriseMessageModal } from "./surprise-message-modal"

interface SurpriseMessageFormProps {
  onSubmit: (message: { sender_name: string; message: string; password: string }) => Promise<void>
}

export function SurpriseMessageForm({ onSubmit }: SurpriseMessageFormProps) {
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState<{ sender_name: string; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (password === ".215061") {
      setIsModalOpen(true)
    } else {
      try {
        const response = await fetch(`/api/surprise-messages?password=${password}`)
        if (response.ok) {
          const data = await response.json()
          setMessage(data)
        } else {
          // Handle error
        }
      } catch (error) {
        console.error("Failed to fetch surprise message:", error)
      }
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Card className="p-6 bg-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">Surprise Message</h3>
            <p className="text-sm text-muted-foreground">Enter the password to leave a surprise message</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full btn-pink">
            {isSubmitting ? "Unlocking..." : "Unlock Message"}
          </Button>
        </form>
      </Card>

      <SurpriseMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
      />

      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 bg-card">
            <h3 className="font-heading font-bold text-lg">{message.sender_name}</h3>
            <p>{message.message}</p>
            <Button onClick={() => setMessage(null)}>Close</Button>
          </Card>
        </div>
      )}
    </>
  )
}