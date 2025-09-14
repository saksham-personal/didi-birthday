-- Create database tables for the birthday website

-- Messages table for the message wall
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    color VARCHAR(20) DEFAULT 'pink',
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memories table for the photo gallery
CREATE TABLE IF NOT EXISTS memories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    date_taken DATE,
    location VARCHAR(255),
    submitted_by VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surprise messages table for private messages
CREATE TABLE IF NOT EXISTS surprise_messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    password VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Likes tracking table
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    item_type VARCHAR(20) NOT NULL, -- 'message' or 'memory'
    item_id INTEGER NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(item_type, item_id, ip_address)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_surprise_messages_created_at ON surprise_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_item ON likes(item_type, item_id);
