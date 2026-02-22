import { createClient } from '@supabase/supabase-js'

// Interfaces principales para el dominio
export interface DatabaseTool {
  id: string
  created_at?: string
  updated_at?: string
  title: string
  summary: string
  image: string
  url: string
  tags: string[]
  user_id?: string
  playlist_id: string
}

export interface DatabasePlaylist {
  id: string
  created_at?: string
  updated_at?: string
  name: string
  description?: string
  icon: string
  user_id?: string
  count?: number
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// Tipo para contenido de YouTube clasificado por IA
export interface YouTubeContent {
  id: string
  video_id: string
  title: string
  description?: string
  channel_name: string
  channel_url?: string
  video_url: string
  thumbnail_url?: string
  duration?: string
  published_at?: string
  view_count?: number
  like_count?: number
  
  // Clasificación por IA
  ai_classification: {
    category: string
    subcategory?: string
    tools_detected: string[]
    confidence: number
    reasoning: string
  }
  confidence_score?: number
  related_tools: string[]
  playlist_id?: string
  
  // Metadatos adicionales
  tags: string[]
  ai_summary?: string
  ai_key_points?: string[]
  
  user_id?: string
  created_at?: string
  updated_at?: string
  
  // Datos enriquecidos (joins)
  playlist?: {
    id: string
    name: string
    icon: string
  }
}

// Database types para Supabase
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
      youtube_content: {
        Row: YouTubeContent
        Insert: Omit<YouTubeContent, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<YouTubeContent, 'id' | 'created_at'>>
      }
    }
  }
}

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