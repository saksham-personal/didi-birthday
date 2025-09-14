"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, ExternalLink, Play } from "lucide-react"
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

interface AlbumViewerProps {
  album: Album | null
  onClose: () => void
}

export function AlbumViewer({ album, onClose }: AlbumViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!album) return null

  const currentItem = album.items[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : album.items.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < album.items.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="relative max-w-4xl max-h-full w-full bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{album.title}</h2>
            <p className="text-sm text-gray-600">
              {currentIndex + 1} of {album.items.length} • By {album.submitter}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="relative h-96 bg-gray-100 flex items-center justify-center">
          {currentItem.type === "image" ? (
            <img
              src={currentItem.url || "/placeholder.svg"}
              alt={`${album.title} - ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Play className="w-16 h-16 text-gray-400" />
              <p className="text-gray-600">Video content</p>
              <Button onClick={() => window.open(currentItem.url, "_blank")} className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Open Video
              </Button>
            </div>
          )}

          {/* Navigation */}
          {album.items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToNext}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {album.items.length > 1 && (
          <div className="p-4 border-t">
            <div className="flex gap-2 overflow-x-auto">
              {album.items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === currentIndex ? "border-primary" : "border-gray-200"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
