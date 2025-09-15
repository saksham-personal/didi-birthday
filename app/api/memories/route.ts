import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get("sort") || "newest"

    let orderClause = "ORDER BY created_at DESC"
    if (sortBy === "oldest") {
      orderClause = "ORDER BY created_at ASC"
    } else if (sortBy === "popular") {
      orderClause = "ORDER BY likes DESC, created_at DESC"
    }

    const memories = await sql`
      SELECT m.*, json_agg(ai) as items
      FROM memories m
      LEFT JOIN album_items ai ON m.id = ai.album_id
      WHERE m.is_approved = true
      GROUP BY m.id
      ${sql.unsafe(orderClause)}
    `

    return NextResponse.json(memories)
  } catch (error) {
    console.error("Error fetching memories:", error)
    return NextResponse.json({ error: "Failed to fetch memories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url, date_taken, location, submitted_by } = body

    if (!title || !description || !submitted_by) {
      return NextResponse.json({ error: "Title, description, and submitted_by are required" }, { status: 400 })
    }


    const [newMemory] = await sql`
      INSERT INTO memories (title, description, submitted_by)
      VALUES (${title}, ${description}, ${submitted_by})
      RETURNING *
    `

    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await sql`
          INSERT INTO album_items (album_id, type, url, thumbnail)
          VALUES (${newMemory.id}, ${item.type}, ${item.url}, ${item.thumbnail})
        `
      }
    }

    return NextResponse.json(newMemory, { status: 201 })
  } catch (error) {
    console.error("Error creating memory:", error)
    return NextResponse.json({ error: "Failed to create memory" }, { status: 500 })
  }
}
