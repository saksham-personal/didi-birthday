"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AlbumCard } from "@/components/album-card"
import { AlbumViewer } from "@/components/album-viewer"
import { AlbumUploadModal } from "@/components/album-upload-modal"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter } from "lucide-react"

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

export default function MemoriesPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const fetchAlbums = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/memories")
      if (response.ok) {
        const data = await response.json()
        const formattedAlbums = data.map((album: any) => ({
          ...album,
          uploadedAt: new Date(album.created_at).toISOString(),
          submitter: album.submitted_by,
        }))
        setAlbums(formattedAlbums)
      }
    } catch (error) {
      console.error("Failed to fetch albums:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  const handleNewAlbum = async (albumData: any) => {
    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(albumData),
      })
      if (response.ok) {
        fetchAlbums()
      }
    } catch (error) {
      console.error("Failed to submit album:", error)
    }
  }

  const handleLike = (albumId: string) => {
    setAlbums((prev) => prev.map((album) => (album.id === albumId ? { ...album, likes: album.likes + 1 } : album)))
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const sortedAlbums = [...albums].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case "oldest":
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      case "popular":
        return b.likes - a.likes
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading font-black text-4xl md:text-6xl text-primary mb-4">Memories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of beautiful moments, adventures, and memories captured through a digital lens, cherished by words.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>

              <Button onClick={() => setIsUploadModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white">
                Share Memory
              </Button>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
                  className="px-3 py-1 rounded-md border border-border bg-background text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-2">Memory Albums ({albums.length})</h2>
            <p className="text-muted-foreground">Cherished moments captured in time</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} onView={setSelectedAlbum} />
            ))}
          </div>

          {albums.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No memory albums shared yet. Be the first to upload a special collection!
              </p>
            </div>
          )}
        </div>
      </main>

      <AlbumViewer album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />

      <AlbumUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleNewAlbum}
      />
    </div>
  )
}
