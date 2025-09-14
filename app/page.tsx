import { CountdownTimer } from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Heart, MessageCircle, Camera, Gift } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">

      {/* Hero Section */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <section className="text-center py-16">
            <div className="mb-8">
              <h1 className="font-heading font-black text-5xl md:text-7xl text-foreground mb-4">Happy 32nd Birthday</h1>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-6">
                Dear Prakshi didi 
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                This is a small token of love and admiration where all your bros and sis contribute their part to make your birthday a little bit more special.
                <br></br>
                We have a message wall, a memory album, and a special secret message from each one of us.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/message-wall">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Leave a Message
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/memories">
                  <Camera className="w-5 h-5 mr-2" />
                  View Memories
                </Link>
              </Button>
            </div>
          </section>

          {/* Countdown Section */}
          <section className="mb-16">
            <CountdownTimer />
          </section>

          {/* Quick Links Section */}
          <section className="py-16">
            <h3 className="font-heading font-bold text-3xl text-center text-foreground mb-12">What do you wanna see?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
                <Link href="/message-wall" className="block text-center">
                  <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl mb-2">Message Wall</h4>
                  <p className="text-muted-foreground">Share your birthday wishes and heartfelt messages</p>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
                <Link href="/memories" className="block text-center">
                  <Camera className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl mb-2">Memories Gallery</h4>
                  <p className="text-muted-foreground">Browse through beautiful memories and moments</p>
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
                <Link href="/surprise" className="block text-center">
                  <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-heading font-bold text-xl mb-2">Surprise Message</h4>
                  <p className="text-muted-foreground">Leave a private message for our beloved Paru Didi</p>
                </Link>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">
            Made with <Heart className="w-4 h-4 inline text-primary fill-current" /> by Saksham.
          </p>
        </div>
      </footer>
    </div>
  )
}
