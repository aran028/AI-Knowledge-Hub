"use client"

import { useState, useEffect } from 'react'
import { supabase, type DatabaseTool, type DatabasePlaylist } from '@/lib/supabase-auth'
import { useAuth } from '@/hooks/use-auth'
import type { Tool, Playlist } from '@/lib/data'

// Hook para obtener playlists/categorías
export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchPlaylists()
    } else {
      setPlaylists([])
      setLoading(false)
    }
  }, [user])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      // Contar herramientas por playlist usando la relación
      const playlistsWithCount = await Promise.all(
        (data || []).map(async (playlist) => {
          const { count } = await supabase
            .from('tools')
            .select('*', { count: 'exact', head: true })
            .eq('playlist_id', playlist.id)

          return {
            id: playlist.id,
            name: playlist.name,
            icon: playlist.icon,
            count: count || 0,
          }
        })
      )

      setPlaylists(playlistsWithCount)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { playlists, loading, error, refetch: fetchPlaylists }
}

// Hook para obtener herramientas con filtros
export function useTools(playlistId?: string | null) {
  const [tools, setTools] = useState<{
    recentlyAdded: Tool[]
    popularTools: Tool[]
    myProjects: Tool[]
    trendingNow: Tool[]
  }>({
    recentlyAdded: [],
    popularTools: [],
    myProjects: [],
    trendingNow: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchTools()
    } else {
      setTools({
        recentlyAdded: [],
        popularTools: [],
        myProjects: [],
        trendingNow: [],
      })
      setLoading(false)
    }
  }, [playlistId, user])

  const fetchTools = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('tools')
        .select(`
          id,
          title,
          summary,
          image,
          url,
          tags,
          created_at,
          playlists!inner(
            id,
            name
          )
        `)
      
      if (playlistId) {
        query = query.eq('playlist_id', playlistId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      const allTools = (data || []).map((tool: any) => ({
        id: tool.id,
        title: tool.title,
        summary: tool.summary,
        category: tool.playlists.name,
        image: tool.image,
        url: tool.url,
        tags: tool.tags,
      }))

      // Dividir herramientas por tipo (puedes ajustar esta lógica según tus necesidades)
      setTools({
        recentlyAdded: allTools.slice(0, 4),
        popularTools: allTools.filter((_, index) => index % 4 === 0),
        myProjects: allTools.filter((_, index) => index % 4 === 1),
        trendingNow: allTools.filter((_, index) => index % 4 === 2),
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { tools, loading, error, refetch: fetchTools }
}

// Hook para agregar una nueva herramienta
export function useAddTool() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const addTool = async (tool: Omit<DatabaseTool, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to add tools')
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tools')
        .insert([{ ...tool, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { addTool, loading, error }
}

// Hook para agregar una nueva playlist
export function useAddPlaylist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const addPlaylist = async (playlist: Omit<DatabasePlaylist, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to add playlists')
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('playlists')
        .insert([{ ...playlist, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { addPlaylist, loading, error }
}