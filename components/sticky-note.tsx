"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyNoteProps {
  id: string
  message: string
  author: string
  title?: string // Added optional title field
  timestamp: Date
  likes: number
  color?: "pink" | "blue" | "yellow" | "green" | "purple" | "orange" | "teal" | "rose"
  onDelete?: (id: string) => void
  showDelete?: boolean
  onClick?: () => void // Added onClick handler for expanding message
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

export function StickyNote({
  id,
  message,
  author,
  title, // Added title prop
  timestamp,
  likes,
  color = "pink",
  onLike,
  onDelete,
  showDelete = false,
  onClick, // Added onClick prop
}: StickyNoteProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation() // Prevent triggering onClick when clicking like button
      if (isLiking) return

      setIsLiking(true)
      const newLikedState = !isLiked
      setIsLiked(newLikedState)

      if (newLikedState) {
        const confetti = (await import("canvas-confetti")).default
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        })
      }

      try {
        const response = await fetch(`/api/messages/${id}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })

        if (!response.ok) {
          // Revert on error
          setIsLiked(!newLikedState)
        }
      } catch (error) {
        // Revert on error
        setIsLiked(!newLikedState)
        console.error("Error liking message:", error)
      } finally {
        setIsLiking(false)
      }

    },
    [id, isLiked, isLiking],
  )

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering onClick when clicking delete button
    onDelete?.(id)
  }

  return (
    <Card
      className={cn(
        "sticky-note p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer",
        colorClasses[color],
        "transform hover:scale-105",
      )}
      onClick={onClick} // Added onClick handler to card
    >
      <div className="space-y-3">
        {title && <h3 className="font-bold text-sm border-b border-current/20 pb-1">{title}</h3>}

        <p className="text-sm leading-relaxed font-medium line-clamp-3">{message}</p>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-[11px]">— {author}</p>
            <p className="opacity-70">{new Date(timestamp).toLocaleDateString('en-GB')}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={cn("h-8 px-2 hover:bg-white/50", isLiked && "text-red-500")}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span className="ml-1 text-xs">{likes + (isLiked ? 1 : 0)}</span>
            </Button>

            {showDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 px-2 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
