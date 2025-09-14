import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const messageId = Number.parseInt(params.id)
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""

    if (isNaN(messageId)) {
      return NextResponse.json({ error: "Invalid message ID" }, { status: 400 })
    }

    // Check if already liked by this IP
    const existingLike = await sql`
      SELECT id FROM likes 
      WHERE item_type = 'message' AND item_id = ${messageId} AND ip_address = ${ip}
    `

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 })
    }

    // Add like record
    await sql`
      INSERT INTO likes (item_type, item_id, ip_address, user_agent)
      VALUES ('message', ${messageId}, ${ip}, ${userAgent})
    `

    // Update message likes count
    const [updatedMessage] = await sql`
      UPDATE messages 
      SET likes = likes + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${messageId}
      RETURNING *
    `

    if (!updatedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: updatedMessage.likes })
  } catch (error) {
    console.error("Error liking message:", error)
    return NextResponse.json({ error: "Failed to like message" }, { status: 500 })
  }
}
