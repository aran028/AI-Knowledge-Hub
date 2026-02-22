"use client"

import { useState, useEffect } from 'react'
import { supabase, type YouTubeContent } from '@/shared/config/supabase-auth'
import { useAuth } from '@/src/presentation/hooks/use-auth.hook'

// Hook para obtener contenido de YouTube
export function useYouTubeContent(playlistId?: string | null, filters?: {
  search?: string
  minConfidence?: number
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  limit?: number
}) {
  const [content, setContent] = useState<YouTubeContent[]>([])
  const [loading, setLoading] = useState(true) // Start with true, then set specific state
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    if (initialized) return // Prevent multiple initializations
    
    setInitialized(true)
    
    // Intentar cargar datos reales de YouTube si hay usuario, sino mostrar demo
    if (user) {
      fetchContent()
    } else {
      // Datos demo solo cuando no hay usuario autenticado
      const sampleContent: YouTubeContent[] = [
        {
          id: 'demo-1',
          video_id: 'dQw4w9WgXcQ',
          title: 'Guía Completa de ChatGPT para Desarrolladores',
          description: 'Aprende a integrar ChatGPT en tus aplicaciones y flujos de trabajo de desarrollo.',
          channel_name: 'AI Development Tutorial',
          channel_url: 'https://youtube.com/@aidevelopment',
          video_url: 'https://youtube.com/watch?v=demo1',
          thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
          duration: 'PT15M30S',
          published_at: new Date().toISOString(),
          view_count: 15420,
          like_count: 892,
          ai_classification: {
            category: 'IA/ML',
            subcategory: 'ChatGPT',
            tools_detected: ['ChatGPT'],
            confidence: 0.95,
            reasoning: 'Video sobre desarrollo con ChatGPT'
          },
          confidence_score: 0.95,
          related_tools: ['ChatGPT', 'OpenAI API'],
          playlist_id: undefined,
          tags: ['chatgpt', 'openai', 'desarrollo', 'api'],
          ai_summary: 'Tutorial completo sobre integración de ChatGPT',
          ai_key_points: ['Configuración de API', 'Mejores prácticas', 'Casos de uso'],
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]
      
      // Apply basic search filter for demo
      if (filters?.search) {
        const filtered = sampleContent.filter(item => 
          item.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          item.description?.toLowerCase().includes(filters.search!.toLowerCase())
        )
        setContent(filtered)
      } else {
        setContent(sampleContent.slice(0, filters?.limit || 6))
      }
      
      setLoading(false)
    }
  }, [user, initialized]) // Remove filters dependency to prevent re-initialization

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase
        .from('youtube_content')
        .select(`
          *,
          playlists (
            id,
            name,
            icon
          )
        `)
        .order('created_at', { ascending: false })

      // Filter by playlist if specified
      if (playlistId) {
        query = query.eq('playlist_id', playlistId)
      }

      // Filter by minimum confidence
      if (filters?.minConfidence) {
        query = query.gte('confidence_score', filters.minConfidence)
      }

      // Filter by search in title or description
      if (filters?.search && filters.search.trim()) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      // Filter by tags
      if (filters?.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags)
      }

      // Filter by date range
      if (filters?.dateRange) {
        query = query
          .gte('published_at', filters.dateRange.start.toISOString())
          .lte('published_at', filters.dateRange.end.toISOString())
      }

      // Apply limit
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      const processedContent: YouTubeContent[] = (data || []).map((item: any) => ({
        id: item.id,
        video_id: item.video_id,
        title: item.title,
        description: item.description,
        channel_name: item.channel_name,
        channel_url: item.channel_url,
        video_url: item.video_url,
        thumbnail_url: item.thumbnail_url || `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`,
        duration: item.duration,
        published_at: item.published_at,
        view_count: item.view_count,
        like_count: item.like_count,
        ai_classification: item.ai_classification,
        confidence_score: item.confidence_score,
        related_tools: item.related_tools,
        playlist_id: item.playlist_id,
        tags: item.tags,
        ai_summary: item.ai_summary,
        ai_key_points: item.ai_key_points,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
        playlist: item.playlists ? {
          id: item.playlists.id,
          name: item.playlists.name,
          icon: item.playlists.icon,
        } : undefined,
      }))

      console.log(`✅ Loaded ${processedContent.length} YouTube videos from database`)
      setContent(processedContent)
    } catch (error: any) {
      console.warn('YouTube content fetch failed, showing empty array:', error.message)
      setContent([])  // Empty array when database fails
      setError(error.message)  // Show error for debugging
    } finally {
      setLoading(false)
    }
  }

  return { content, loading, error, refetch: fetchContent }
}

// Hook para obtener estadísticas del contenido de YouTube
export function useYouTubeStats() {
  const [stats, setStats] = useState<{
    totalVideos: number
    totalChannels: number
    totalViews: number
    videosThisWeek: number
    averageConfidence: number
    topCategories: Array<{ category: string; count: number }>
    topTools: Array<{ tool: string; count: number }>
    recentlyAdded: number
  } | null>({
    totalVideos: 1,
    totalChannels: 1,
    totalViews: 15420,
    videosThisWeek: 1,
    averageConfidence: 95,
    topCategories: [
      { category: 'IA/ML', count: 1 }
    ],
    topTools: [
      { tool: 'ChatGPT', count: 1 },
      { tool: 'OpenAI API', count: 1 }
    ],
    recentlyAdded: 1,
  }) // Initialize with demo data to prevent flashing
  const [loading, setLoading] = useState(false) // Start without loading
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchStats()
    }
    // Stats are initialized with demo data, so no need for else clause
  }, [user])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('youtube_content')
        .select('ai_classification, confidence_score, related_tools, channel_name, created_at, view_count')

      if (error) throw error

      const videos = data as YouTubeContent[] || []
      
      // Calculate statistics
      const totalVideos = videos.length
      const uniqueChannels = new Set(videos.map(v => v.channel_name)).size
      const averageConfidence = totalVideos > 0 ? videos.reduce((sum, v) => sum + (v.confidence_score || 0), 0) / totalVideos : 0
      const totalViews = videos.reduce((sum, v) => sum + (v.view_count || 0), 0)

      // Videos added recently (last 7 days)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const videosThisWeek = videos.filter(v => 
        new Date(v.created_at || Date.now()) >= oneWeekAgo
      ).length

      // Top categories
      const categoryCount: Record<string, number> = {}
      videos.forEach(v => {
        const category = v.ai_classification?.category
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1
        }
      })
      const topCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Top tools
      const toolCount: Record<string, number> = {}
      videos.forEach(v => {
        v.related_tools?.forEach((tool: string) => {
          toolCount[tool] = (toolCount[tool] || 0) + 1
        })
      })
      const topTools = Object.entries(toolCount)
        .map(([tool, count]) => ({ tool, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      setStats({
        totalVideos,
        totalChannels: uniqueChannels,
        totalViews,
        videosThisWeek,
        averageConfidence,
        topCategories,
        topTools,
        recentlyAdded: videosThisWeek,
      })

      console.log(`✅ YouTube stats: ${totalVideos} videos, ${uniqueChannels} channels`)

    } catch (error: any) {
      console.warn('YouTube stats fetch failed, keeping demo stats:', error.message)
      setError(error.message) // Show error for debugging
    } finally {
      setLoading(false)
    }
  }

  return { stats, loading, error, refetch: fetchStats }
}

// Hook para marcar contenido como favorito o eliminar
export function useManageYouTubeContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteContent = async (contentId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('youtube_content')
        .delete()
        .eq('id', contentId)

      if (error) throw error

    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updatePlaylist = async (contentId: string, playlistId: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('youtube_content')
        .update({ playlist_id: playlistId } as any)
        .eq('id', contentId)

      if (error) throw error

    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteContent, updatePlaylist, loading, error }
}