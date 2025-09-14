"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface PersonalMessage {
  id: string
  sender: string
  message: string
  password: string
  color?: "pink" | "blue" | "purple" | "gold"
}

const colorClasses = {
  pink: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200",
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
  purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
  gold: "bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-200",
}

export function PasswordProtectedMessage() {
  const [password, setPassword] = useState("")
  const [unlockedMessage, setUnlockedMessage] = useState<PersonalMessage | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const personalMessages: PersonalMessage[] = [
    {
      id: "1",
      sender: "Mom & Dad",
      message:
        "Our dearest Prakshi, watching you grow into the incredible doctor and person you are today fills our hearts with immense pride. Your compassion, dedication, and strength inspire everyone around you. Happy 32nd birthday, beta! May this year bring you all the joy and success you deserve. We love you more than words can express. 💕",
      password: "family2024",
      color: "pink",
    },
    {
      id: "2",
      sender: "Your College Bestie Sarah",
      message:
        "Prakshi! Can you believe it's been over a decade since we were cramming for med school exams together? You've achieved everything we dreamed about and more. Your patients are so lucky to have someone as caring and brilliant as you. Here's to another year of adventures, late-night calls, and being the amazing friend you've always been. Happy birthday, doc! 🎉",
      password: "medschool",
      color: "blue",
    },
    {
      id: "3",
      sender: "Dr. Patel (Your Mentor)",
      message:
        "Dr. Prakshi, it has been an absolute privilege watching you develop into the exceptional physician you are today. Your dedication to your patients and your continuous pursuit of excellence in medicine is truly admirable. On your 32nd birthday, I want you to know how proud I am of all your accomplishments. Keep shining bright! 🌟",
      password: "mentor123",
      color: "purple",
    },
    {
      id: "4",
      sender: "Your Hospital Team",
      message:
        "Happy Birthday Dr. Prakshi! 🎂 Working alongside you has been such an honor. Your kindness, expertise, and positive energy make every day at the hospital better. Thank you for being not just an amazing colleague, but also a wonderful friend. We're so grateful to have you on our team. Here's to celebrating you today and always! - The entire ICU team ❤️",
      password: "hospital2024",
      color: "gold",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const foundMessage = personalMessages.find((msg) => msg.password === password.toLowerCase())

    if (foundMessage) {
      setUnlockedMessage(foundMessage)
      setShowConfetti(true)
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      setError("Incorrect password. Please try again.")
    }

    setIsLoading(false)
  }

  const resetMessage = () => {
    setUnlockedMessage(null)
    setPassword("")
    setError("")
    setShowConfetti(false)
  }

  if (unlockedMessage) {
    return (
      <div className="relative">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  {["🎉", "🎊", "✨", "🌟", "💖", "🎂"][Math.floor(Math.random() * 6)]}
                </div>
              ))}
            </div>
          </div>
        )}

        <Card className={cn("p-8 shadow-xl", colorClasses[unlockedMessage.color || "pink"])}>
          <div className="text-center mb-6">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-heading font-bold text-2xl text-primary">Personal Message Unlocked!</h3>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="font-heading font-semibold text-lg text-foreground mb-2">From: {unlockedMessage.sender}</p>
            </div>

            <div className="bg-white/70 p-6 rounded-lg shadow-inner">
              <p className="text-foreground leading-relaxed text-center whitespace-pre-wrap">
                {unlockedMessage.message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
              <span className="font-heading font-medium text-primary">With Love</span>
              <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
            </div>

            <div className="text-center">
              <Button onClick={resetMessage} variant="outline" className="mt-4 bg-transparent">
                View Another Message
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <div className="text-center mb-6">
        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-heading font-bold text-2xl text-primary mb-2">Personal Messages</h3>
        <p className="text-muted-foreground">
          Special birthday messages from your loved ones are waiting for you. Enter the password to unlock them.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            className="mt-1"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button type="submit" className="w-full" disabled={isLoading || !password.trim()}>
          {isLoading ? "Unlocking..." : "Unlock Message"}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          Hint: Try passwords related to family, medical school, mentorship, or hospital life
        </p>
      </div>
    </Card>
  )
}
