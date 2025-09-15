"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isClient, setIsClient] = useState(false)

  const birthdayDate = useMemo(() => new Date("2025-09-16T00:00:00+05:30"), [])

  useEffect(() => {
    setIsClient(true)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = birthdayDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [birthdayDate])

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <h2 className="font-heading font-black text-4xl md:text-6xl text-primary mb-8">Countdown to </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 bg-card animate-pulse">
              <div className="h-12 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ]

  return (
    <div className="text-center py-12">
      <h2 className="font-heading font-black text-4xl md:text-6xl text-primary mb-8 animate-bounce-gentle">
        Countdown to Celebration!
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {timeUnits.map((unit, index) => (
          <Card key={unit.label} className="p-6 bg-card hover:bg-primary/10 transition-colors duration-300">
            <div className="font-heading font-black text-3xl md:text-4xl text-primary mb-2">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-muted-foreground font-medium uppercase tracking-wide text-sm">{unit.label}</div>
          </Card>
        ))}
      </div>
      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 && (
        <div className="mt-8">
          <div className="text-6xl animate-bounce-gentle">🎉</div>
          <p className="font-heading font-bold text-2xl text-primary mt-4">Happy birthday our beloved Paru!</p>
        </div>
      )}
    </div>
  )
}
