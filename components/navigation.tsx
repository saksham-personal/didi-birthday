"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Gift, MessageCircle, Camera } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/message-wall", label: "Message Wall", icon: MessageCircle },
  { href: "/memories", label: "Memories", icon: Camera },
  { href: "/surprise", label: "Surprise", icon: Gift },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Gift className="w-6 h-6 text-primary" />
              <span>Prakshi's Birthday</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Button key={link.href} asChild variant="ghost" className={cn(pathname === link.href && "text-primary")}>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Button key={link.href} asChild variant="ghost" className={cn(pathname === link.href && "text-primary")}>
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}