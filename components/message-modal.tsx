"use client"

import { X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  text: string
  author: string
  title?: string
  timestamp: Date
  likes: number
  color: string
}

interface MessageModalProps {
  message: Message | null
  onClose: () => void
  onLike: (id: string) => void
}

const colorClasses = {
  pink: "bg-pink-100 border-pink-200 text-pink-900",
  blue: "bg-blue-100 border-blue-200 text-blue-900",
  yellow: "bg-yellow-100 border-yellow-200 text-yellow-900",
  green: "bg-green-100 border-green-200 text-green-900",
  purple: "bg-purple-100 border-purple-200 text-purple-900",
  orange: "bg-orange-100 border-orange-200 text-orange-900",
  teal: "bg-teal-100 border-teal-200 text-teal-900",
  rose: "bg-rose-100 border-rose-200 text-rose-900",
}

export function MessageModal({ message, onClose, onLike }: MessageModalProps) {
  if (!message) return null

  const handleLike = async () => {
    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
    onLike(message.id)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className={cn(
          "relative max-w-2xl w-full rounded-lg p-8 shadow-2xl",
          colorClasses[message.color as keyof typeof colorClasses] || colorClasses.pink,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-4 right-4 hover:bg-white/50">
          <X className="w-5 h-5" />
        </Button>

        <div className="space-y-6">
          {message.title && <h2 className="text-2xl font-bold border-b border-current/20 pb-3">{message.title}</h2>}

          <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.text}</p>

          <div className="flex items-center justify-between pt-4 border-t border-current/20">
            <div>
              <p className="font-bold text-lg">— {message.author}</p>
              <p className="opacity-70 text-sm">{message.timestamp.toLocaleDateString()}</p>
            </div>

            <Button
              onClick={handleLike}
              variant="ghost"
              className="flex items-center gap-2 hover:bg-white/50 text-lg px-4 py-2"
            >
              <Heart className="w-6 h-6" />
              <span>{message.likes}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
