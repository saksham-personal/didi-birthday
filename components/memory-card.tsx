"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MemoryCardProps {
  id: string
  imageUrl: string
  title: string
  description: string
  date: string
  location?: string
  submittedBy: string
  likes: number
  onLike?: (id: string) => void
}

export function MemoryCard({
  id,
  imageUrl,
  title,
  description,
  date,
  location,
  submittedBy,
  likes,
  onLike,
}: MemoryCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = useCallback(async () => {
    if (isLiking) return

    setIsLiking(true)
    const newLikedState = !isLiked
    setIsLiked(newLikedState)

    try {
      const response = await fetch(`/api/memories/${id}/like`, {
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
      console.error("Error liking memory:", error)
    } finally {
      setIsLiking(false)
    }

    onLike?.(id)
  }, [id, isLiked, isLiking, onLike])

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-card group">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className={cn(
            "object-cover transition-all duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}

        {/* Overlay with like button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLike}
            className={cn("h-8 w-8 p-0 bg-white/90 hover:bg-white", isLiked && "text-red-500")}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{description}</p>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>

          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Shared by {submittedBy}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={cn("h-8 px-2 hover:bg-primary/10", isLiked && "text-red-500")}
          >
            <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
            <span className="text-xs">{likes + (isLiked ? 1 : 0)}</span>
          </Button>

          <span className="text-xs text-muted-foreground">Memory #{id}</span>
        </div>
      </div>
    </Card>
  )
}
