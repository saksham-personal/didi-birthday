"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface AlbumItem {
  type: "image" | "video"
  url: string
  file?: File
}

interface AlbumUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (albumData: any) => void
}

export function AlbumUploadModal({ isOpen, onClose, onSubmit }: AlbumUploadModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitter, setSubmitter] = useState("")
  const [items, setItems] = useState<AlbumItem[]>([])
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const { url } = await response.json();
        setItems((prev) => [...prev, { type: "image", url }]);

      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    setIsUploading(false);
  };

  const handleVideoLinkAdd = () => {
    const link = prompt("Enter Google Drive video link:")
    if (link) {
      setItems((prev) => [...prev, { type: "video", url: link }])
    }
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !submitter || items.length === 0) return

    const albumData = {
      title: title,
      description: description,
      submitted_by: submitter,
      items,
      uploadedAt: new Date().toISOString(),
    }

    onSubmit(albumData)

    // Reset form
    setTitle("")
    setDescription("")
    setSubmitter("")
    setItems([])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Share Memory Album</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="submitter">Your Name *</Label>
            <Input
              id="submitter"
              value={submitter}
              onChange={(e) => setSubmitter(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Album Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your album a title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about these memories..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Add Photos & Videos</Label>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Add Photos
              </Button>
              <Button type="button" variant="outline" onClick={handleVideoLinkAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Video Link
              </Button>
            </div>

            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {items.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {items.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {item.type === "image" ? (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 mx-auto mb-2 text-gray-400">📹</div>
                            <p className="text-xs text-gray-600">Video</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title || !submitter || items.length === 0}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Share Album
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
