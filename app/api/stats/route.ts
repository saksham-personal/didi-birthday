import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Get various statistics for the birthday website
    const [messageStats] = await sql`
      SELECT 
        COUNT(*) as total_messages,
        SUM(likes) as total_message_likes
      FROM messages 
      WHERE is_approved = true
    `

    const [memoryStats] = await sql`
      SELECT 
        COUNT(*) as total_memories,
        SUM(likes) as total_memory_likes
      FROM memories 
      WHERE is_approved = true
    `

    const [personalMessageStats] = await sql`
      SELECT 
        COUNT(*) as total_personal_messages,
        COUNT(*) FILTER (WHERE is_read = false) as unread_personal_messages
      FROM personal_messages
    `

    const [recentActivity] = await sql`
      SELECT COUNT(*) as recent_messages
      FROM messages 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      AND is_approved = true
    `

    const stats = {
      messages: {
        total: Number.parseInt(messageStats.total_messages),
        totalLikes: Number.parseInt(messageStats.total_message_likes || 0),
      },
      memories: {
        total: Number.parseInt(memoryStats.total_memories),
        totalLikes: Number.parseInt(memoryStats.total_memory_likes || 0),
      },
      personalMessages: {
        total: Number.parseInt(personalMessageStats.total_personal_messages),
        unread: Number.parseInt(personalMessageStats.unread_personal_messages),
      },
      activity: {
        recentMessages: Number.parseInt(recentActivity.recent_messages),
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
