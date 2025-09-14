"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon } from "lucide-react"

interface MemoryUploadFormProps {
  onSubmit: (memory: {
    title: string
    description: string
    date: string
    location: string
    submittedBy: string
    imageFile: File | null
  }) => void
}

export function MemoryUploadForm({ onSubmit }: MemoryUploadFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [submittedBy, setSubmittedBy] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !submittedBy.trim()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        date: date || new Date().toISOString().split("T")[0],
        location: location.trim(),
        submittedBy: submittedBy.trim(),
        imageFile,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setDate("")
      setLocation("")
      setSubmittedBy("")
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error("Failed to submit memory:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="submittedBy" className="text-sm font-medium">
            Your Name
          </Label>
          <Input
            id="submittedBy"
            value={submittedBy}
            onChange={(e) => setSubmittedBy(e.target.value)}
            placeholder="Enter your name"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Memory Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this memory a title"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share the story behind this memory..."
            required
            rows={3}
            className="mt-1 resize-none"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground mt-1">{description.length}/300 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="location" className="text-sm font-medium">
              Location (Optional)
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this taken?"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Photo</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md border border-border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!title.trim() || !description.trim() || !submittedBy.trim() || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Share Memory
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
