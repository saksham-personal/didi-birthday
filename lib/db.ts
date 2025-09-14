// Database connection and query utilities
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

// Database types
export interface Message {
  id: number
  text: string
  author: string
  color: string
  likes: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Memory {
  id: number
  title: string
  description: string
  image_url: string | null
  date_taken: string | null
  location: string | null
  submitted_by: string
  likes: number
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface PersonalMessage {
  id: number
  sender_name: string
  sender_email: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface Like {
  id: number
  item_type: "message" | "memory"
  item_id: number
  ip_address: string | null
  user_agent: string | null
  created_at: string
}
