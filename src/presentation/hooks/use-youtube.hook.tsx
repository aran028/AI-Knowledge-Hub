"use client"

import { useState, useEffect } from "react"

export type YouTubeContent = {
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
  view_count: number
  like_count: number
  ai_classification?: {
    category: string
    reasoning: string
    confidence: number
    tools_detected: string[]
  }
  confidence_score?: number
  related_tools: string[]
  tags: string[]
  ai_key_points: string[]
  ai_summary?: string
  playlist_id?: string
  created_at: string
  updated_at: string
}

export type YouTubeStats = {
  total_videos: number
  recent_videos: number
  categories: { [key: string]: number }
  average_confidence: number
  confidence_distribution: {
    high: number
    medium: number
    low: number
  }
}

export function useYouTubeContent(
  playlistId?: string,
  filters?: {
    search?: string
    minConfidence?: number
    limit?: number
  }
) {
  const [content, setContent] = useState<YouTubeContent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (filters?.search) params.append('search', filters.search)
      if (playlistId) params.append('playlist', playlistId)
      if (filters?.minConfidence) params.append('minConfidence', filters.minConfidence.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/youtube/videos?${params}`)
      const result = await response.json()

      if (result.success) {
        setContent(result.data)
      } else {
        setError(result.error || 'Error fetching videos')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching YouTube content:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [playlistId, filters?.search, filters?.minConfidence, filters?.limit])

  return {
    content,
    loading,
    error,
    refetch: fetchContent
  }
}

export function useYouTubeStats() {
  const [stats, setStats] = useState<YouTubeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/youtube/stats')
      const result = await response.json()

      if (result.success) {
        setStats(result.stats)
      } else {
        setError(result.error || 'Error fetching stats')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching YouTube stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

export function useManageYouTubeContent() {
  const [loading, setLoading] = useState(false)

  const updateContent = async (id: string, updates: Partial<YouTubeContent>) => {
    setLoading(true)
    try {
      // Placeholder para actualizar contenido de YouTube
      // En el futuro se implementará con la API
      console.log('Updating YouTube content:', id, updates)
      return { success: true }
    } catch (error) {
      console.error('Error updating YouTube content:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const deleteContent = async (id: string) => {
    setLoading(true)
    try {
      // Placeholder para eliminar contenido de YouTube
      // En el futuro se implementará con la API
      console.log('Deleting YouTube content:', id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting YouTube content:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  const moveToPlaylist = async (contentId: string, playlistId: string) => {
    setLoading(true)
    try {
      // Placeholder para mover contenido a playlist
      // En el futuro se implementará con la API
      console.log('Moving content to playlist:', contentId, playlistId)
      return { success: true }
    } catch (error) {
      console.error('Error moving content to playlist:', error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateContent,
    deleteContent,
    moveToPlaylist,
    loading
  }
}