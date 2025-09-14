import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sender_name, message, password } = body

    if (!sender_name || !message || !password) {
      return NextResponse.json({ error: "Sender name, message, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const existingMessage = await sql`
      SELECT id FROM surprise_messages WHERE password = ${password}
    `

    if (existingMessage.length > 0) {
      return NextResponse.json({ error: "Password already in use" }, { status: 400 })
    }

    const [newMessage] = await sql`
      INSERT INTO surprise_messages (sender_name, message, password)
      VALUES (${sender_name}, ${message}, ${password})
      RETURNING id, sender_name, created_at
    `

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating surprise message:", error)
    return NextResponse.json({ error: "Failed to send surprise message" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get("password")

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const [message] = await sql`
      SELECT sender_name, message FROM surprise_messages WHERE password = ${password}
    `

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error fetching surprise message:", error)
    return NextResponse.json({ error: "Failed to fetch surprise message" }, { status: 500 })
  }
}
