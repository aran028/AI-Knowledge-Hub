import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for database tables
export interface DatabaseTool {
  id: string
  title: string
  summary: string
  playlist_id: string
  image: string
  url: string
  tags: string[]
  created_at?: string
  updated_at?: string
}

export interface DatabasePlaylist {
  id: string
  name: string
  description?: string
  icon: string
  count?: number
  created_at?: string
  updated_at?: string
}