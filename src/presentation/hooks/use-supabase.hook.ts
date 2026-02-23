"use client"

console.log('📁 use-supabase.hook.ts module loaded!')

import { useState, useEffect } from 'react'
import { supabase, type DatabaseTool, type DatabasePlaylist } from '@/shared/config/supabase-auth'
import { useAuth } from '@/src/presentation/hooks/use-auth.hook'
import type { Tool, Playlist } from '@/shared/types/data'

// Helper function to get empty tools structure as fallback
function getEmptyToolsStructure() {
  return {
    recentlyAdded: [],
    popularTools: [],
    trendingNow: [],
  }
}

// Hook para obtener playlists/categorías
export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]) // Start empty
  const [loading, setLoading] = useState(true) // Start loading to fetch real data
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar datos reales de Supabase
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use our API endpoint instead of direct Supabase query
      const response = await fetch('/api/playlists')
      const apiResult = await response.json()

      if (!response.ok || !apiResult.success) {
        console.warn('API error, using empty array as fallback:', apiResult.error)
        setPlaylists([])
        setError(null)
        setLoading(false)
        return
      }

      if (!apiResult.data || apiResult.data.length === 0) {
        console.info('No playlists found in API, using empty array')
        setPlaylists([]) 
        setLoading(false)
        return
      }

      // Transform API data to match our interface
      const playlistsWithHref = apiResult.data.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        icon: playlist.icon,
        count: playlist.count,
        href: `/?playlist=${playlist.id}`
      }))

      console.log(`✅ Loaded ${playlistsWithHref.length} playlists from API`)
      setPlaylists(playlistsWithHref)
      setError(null)
      
      // Log cada playlist para debugging
      playlistsWithHref.forEach((p: any) => {
        console.log(`   📋 ${p.name}: ${p.count} tools`)
      })
    } catch (error: any) {
      console.warn('API connection failed, using empty array as fallback:', error.message)
      setPlaylists([])
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  return { playlists, loading, error, refetch: fetchPlaylists }
}

export function useTools(playlistId?: string | null) {
  const [tools, setTools] = useState<{
    recentlyAdded: Tool[]
    popularTools: Tool[]
    trendingNow: Tool[]
  }>({
    recentlyAdded: [],
    popularTools: [],
    trendingNow: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTools() {
      try {
        console.log('🚀 LOADING TOOLS...')
        setLoading(true)
        
        const url = playlistId ? `/api/tools?playlist=${playlistId}` : '/api/tools'
        console.log('🔗 Fetching:', url)
        
        const response = await fetch(url)
        console.log('📡 Response status:', response.status, response.ok)
        
        const data = await response.json()
        console.log('📦 API Response structure:', {
          success: data.success,
          hasData: !!data.data,
          recentLength: data.data?.recent?.length,
          popularLength: data.data?.popular?.length
        })

        if (data.success && data.data) {
          const newTools = {
            recentlyAdded: data.data.recent || [],
            popularTools: data.data.popular || [],
            trendingNow: [],
          }
          
          console.log('✅ Setting tools state:', {
            recentCount: newTools.recentlyAdded.length,
            popularCount: newTools.popularTools.length
          })
          
          setTools(newTools)
          setError(null)
        } else {
          console.warn('❌ API failed or invalid structure:', data.error || 'No success/data')
          setError(data.error || 'Failed to load tools')
        }
      } catch (err: any) {
        console.error('💥 Fetch error:', err.message)
        setError(err.message)
      } finally {
        setLoading(false)
        console.log('🏁 Hook loading finished')
      }
    }

    loadTools()
  }, [playlistId])

  return { tools, loading, error, refetch: () => {} }
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
        .insert([{ ...tool, user_id: user.id }] as any)
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
        .insert([{ ...playlist, user_id: user.id }] as any)
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

// Hook para editar una herramienta
export function useEditTool() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const editTool = async (id: string, updates: Partial<Omit<DatabaseTool, 'id' | 'created_at' | 'user_id'>>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to edit tools')
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id) // Solo editar herramientas propias
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

  return { editTool, loading, error }
}

// Hook para eliminar una herramienta
export function useDeleteTool() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const deleteTool = async (id: string) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to delete tools')
      }

      setLoading(true)
      setError(null)

      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Solo eliminar herramientas propias

      if (error) throw error

      return true
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteTool, loading, error }
}

// Hook para editar una playlist
export function useEditPlaylist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const editPlaylist = async (id: string, updates: Partial<Omit<DatabasePlaylist, 'id' | 'created_at' | 'user_id'>>) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to edit playlists')
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('playlists')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id) // Solo editar playlists propias
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

  return { editPlaylist, loading, error }
}

// Hook para eliminar una playlist
export function useDeletePlaylist() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const deletePlaylist = async (id: string) => {
    try {
      if (!user) {
        throw new Error('User must be logged in to delete playlists')
      }

      setLoading(true)
      setError(null)

      // Verificar que la playlist no tenga herramientas asociadas
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('id')
        .eq('playlist_id', id)

      if (toolsError) throw toolsError

      if (tools && tools.length > 0) {
        throw new Error('No se puede eliminar una playlist que contiene herramientas. Elimina o mueve las herramientas primero.')
      }

      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Solo eliminar playlists propias

      if (error) throw error

      return true
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deletePlaylist, loading, error }
}