import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente principal para el navegador
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Más seguro
  },
})

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
  user_id?: string
}

export interface DatabasePlaylist {
  id: string
  name: string
  icon: string
  count?: number
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// Database types placeholder (se puede generar automáticamente)
export interface Database {
  public: {
    Tables: {
      playlists: {
        Row: DatabasePlaylist
        Insert: Omit<DatabasePlaylist, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabasePlaylist, 'id' | 'created_at'>>
      }
      tools: {
        Row: DatabaseTool
        Insert: Omit<DatabaseTool, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DatabaseTool, 'id' | 'created_at'>>
      }
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
    }
  }
}