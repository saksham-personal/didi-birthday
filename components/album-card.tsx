"use client"

import type React from "react"

import { useState } from "react"
import { Heart, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlbumItem {
  type: "image" | "video"
  url: string
  thumbnail?: string
}

interface Album {
  id: string
  title: string
  description: string
  items: AlbumItem[]
  submitter: string
  uploadedAt: string
  likes: number
}

interface AlbumCardProps {
  album: Album
  onView: (album: Album) => void
}

export function AlbumCard({ album, onView }: AlbumCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(album.likes)

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLiked) return

    setIsLiked(true)
    setLikeCount((prev) => prev + 1)

    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    })

  }

  const coverImage = album.items?.find((item) => item.type === "image")?.url || "/placeholder.svg?height=200&width=300"

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => onView(album)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage || "/placeholder.svg"}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
          {album.items.length} items
        </div>
        {album.items.some((item) => item.type === "video") && (
          <div className="absolute bottom-2 left-2">
            <Play className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{album.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{album.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>By {album.submitter}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            {likeCount}
          </Button>
        </div>
      </div>
    </div>
  )
}
