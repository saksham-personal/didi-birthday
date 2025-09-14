import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const memoryId = Number.parseInt(params.id)
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""

    if (isNaN(memoryId)) {
      return NextResponse.json({ error: "Invalid memory ID" }, { status: 400 })
    }

    // Check if already liked by this IP
    const existingLike = await sql`
      SELECT id FROM likes 
      WHERE item_type = 'memory' AND item_id = ${memoryId} AND ip_address = ${ip}
    `

    if (existingLike.length > 0) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 })
    }

    // Add like record
    await sql`
      INSERT INTO likes (item_type, item_id, ip_address, user_agent)
      VALUES ('memory', ${memoryId}, ${ip}, ${userAgent})
    `

    // Update memory likes count
    const [updatedMemory] = await sql`
      UPDATE memories 
      SET likes = likes + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${memoryId}
      RETURNING *
    `

    if (!updatedMemory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 })
    }

    return NextResponse.json({ likes: updatedMemory.likes })
  } catch (error) {
    console.error("Error liking memory:", error)
    return NextResponse.json({ error: "Failed to like memory" }, { status: 500 })
  }
}
