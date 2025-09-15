import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const messages = await sql`
      SELECT * FROM messages 
      WHERE is_approved = true 
      ORDER BY created_at DESC
    `

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, author, color = "pink" } = body

    if (!text || !author) {
      return NextResponse.json({ error: "Text and author are required" }, { status: 400 })
    }


    const [newMessage] = await sql`
      INSERT INTO messages (text, author, color)
      VALUES (${text}, ${author}, ${color})
      RETURNING *
    `

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Error creating message:", error)
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
