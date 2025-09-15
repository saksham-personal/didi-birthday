"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Send, Upload } from "lucide-react"

interface MessageFormProps {
  onSubmit: (message: { text: string; author: string; title: string; color: string }) => void
}

const colors = [
  { name: "pink", class: "bg-pink-100 border-pink-200", label: "Pink" },
  { name: "blue", class: "bg-blue-100 border-blue-200", label: "Blue" },
  { name: "yellow", class: "bg-yellow-100 border-yellow-200", label: "Yellow" },
  { name: "green", class: "bg-green-100 border-green-200", label: "Green" },
  { name: "purple", class: "bg-purple-100 border-purple-200", label: "Purple" },
  { name: "orange", class: "bg-orange-100 border-orange-200", label: "Orange" },
  { name: "teal", class: "bg-teal-100 border-teal-200", label: "Teal" },
  { name: "rose", class: "bg-rose-100 border-rose-200", label: "Rose" },
]

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [message, setMessage] = useState("")
  const [author, setAuthor] = useState("")
  const [title, setTitle] = useState("")
  const [selectedColor, setSelectedColor] = useState("pink")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !author.trim()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        text: message.trim(),
        author: author.trim(),
        title: title.trim(),
        color: selectedColor,
      })

      // Reset form
      setMessage("")
      setAuthor("")
      setTitle("")
      setSelectedColor("pink")
    } catch (error) {
      console.error("Failed to submit message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="author" className="text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Title (Optional)
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your message a title"
            className="mt-1"
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm font-medium">
            Birthday Message
          </Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your birthday message for Dr. Prakshi..."
            required
            rows={4}
            className="mt-1 resize-none"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Note Color</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${color.class} ${
                  selectedColor === color.name ? "ring-2 ring-primary ring-offset-2" : "hover:scale-110"
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!message.trim() || !author.trim() || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            "Posting..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post Message
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}