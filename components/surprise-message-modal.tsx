"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"

interface SurpriseMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (message: { sender_name: string; message: string; password: string }) => Promise<void>
}

export function SurpriseMessageModal({ isOpen, onClose, onSubmit }: SurpriseMessageModalProps) {
  const [senderName, setSenderName] = useState("")
  const [message, setMessage] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        sender_name: senderName,
        message,
        password,
      })
      onClose()
    } catch (error) {
      console.error("Failed to send surprise message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a Surprise Message</DialogTitle>
          <DialogDescription>
            This message will be stored securely and can only be accessed with the password you provide.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={senderName} onChange={(e) => setSenderName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Create a unique password (at least 8 characters).
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="btn-pink">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}