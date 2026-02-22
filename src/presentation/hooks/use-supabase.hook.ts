"use client"

import { useState, useEffect } from 'react'
import { supabase, type DatabaseTool, type DatabasePlaylist } from '@/shared/config/supabase-auth'
import { useAuth } from '@/src/presentation/hooks/use-auth.hook'
import type { Tool, Playlist } from '@/shared/types/data'
// Import static data as fallback
import { 
  playlists as staticPlaylists, 
  recentlyAdded, 
  popularTools, 
  trendingNow, 
  myProjects 
} from '@/shared/types/data'

// Helper function to get static tools organized by structure
function getStaticToolsStructure(playlistId?: string | null) {
  if (playlistId) {
    // Filter tools by playlist if specified
    const filteredTools = [...recentlyAdded, ...popularTools, ...trendingNow, ...myProjects]
      .filter(tool => {
        const playlist = staticPlaylists.find((p: Playlist) => p.name === tool.category)
        return playlist?.id === playlistId
      })
    
    return {
      recentlyAdded: filteredTools.slice(0, 4),
      popularTools: filteredTools, // Todas las herramientas de la playlist
      trendingNow: [], // No usar trending para playlist específicas
    }
  }
  
  // Return all static tools organized
  return {
    recentlyAdded,
    popularTools: popularTools.slice(0, 8), // Limitar para página principal
    myProjects: myProjects.slice(0, 6),
    trendingNow: [], // Eliminado trending
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
      
      // Try Supabase with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
      
      const supabasePromise = supabase
        .from('playlists')
        .select('*')
        .order('name', { ascending: true })

      const result = await Promise.race([supabasePromise, timeoutPromise]) as any

      if (result.error) {
        console.warn('Supabase error, using static data as fallback:', result.error.message)
        setPlaylists(staticPlaylists)
        setError(null) // Keep error null to avoid showing error state
        setLoading(false)
        return
      }

      if (!result.data || result.data.length === 0) {
        console.info('No playlists found in database, using static data')
        setPlaylists(staticPlaylists) 
        setLoading(false)
        return
      }

      // Contar herramientas por playlist usando la relación
      const playlistsWithCount = await Promise.all(
        (result.data || []).map(async (playlist: DatabasePlaylist) => {
          const { count } = await supabase
            .from('tools')
            .select('*', { count: 'exact', head: true })
            .eq('playlist_id', playlist.id)

          return {
            id: playlist.id,
            name: playlist.name,
            icon: playlist.icon,
            count: count || 0,
            href: `/?playlist=${playlist.id}`
          }
        })
      )

      console.log(`✅ Loaded ${playlistsWithCount.length} playlists from Supabase`)
      setPlaylists(playlistsWithCount)
      setError(null) // Clear any previous errors
      
      // Log cada playlist para debugging
      playlistsWithCount.forEach((p: any) => {
        console.log(`   📋 ${p.name}: ${p.count} tools`)
      })
    } catch (error: any) {
      console.warn('Database connection failed, using static data as fallback:', error.message)
      setPlaylists(staticPlaylists)
      setError(null) // Don't show error, just use static data
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
    trendingNow: Tool[]
  }>({
    recentlyAdded: [],
    popularTools: [],
    trendingNow: [],
  }) // Start empty
  const [loading, setLoading] = useState(true) // Start loading
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar datos reales de Supabase
    fetchTools()
  }, [playlistId])

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)
      
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

      // Add timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      )
      
      const supabasePromise = query.order('created_at', { ascending: false })
      const result = await Promise.race([supabasePromise, timeoutPromise]) as any

      if (result.error) {
        console.warn('Supabase tools error, using static data as fallback:', result.error.message)
        // Use static data as complete fallback without showing error
        const staticData = getStaticToolsStructure(playlistId) 
        setTools(staticData)
        setLoading(false)
        return
      }

      // If no data in database, use static data
      if (!result.data || result.data.length === 0) {
        console.info(`No tools found ${playlistId ? `for playlist ${playlistId}` : ''}, using static data`)
        const staticData = getStaticToolsStructure(playlistId)
        setTools(staticData)
        setLoading(false)
        return
      }

      const allTools = (result.data || []).map((tool: any) => ({
        id: tool.id,
        title: tool.title,
        summary: tool.summary,
        category: tool.playlists.name,
        image: tool.image,
        url: tool.url,
        tags: tool.tags,
      }))

      console.log(`✅ Loaded ${allTools.length} tools from Supabase${playlistId ? ` for playlist ${playlistId}` : ''}`)

      // Log herramientas para debugging
      allTools.forEach((tool, i) => {
        if (i < 3) console.log(`   🛠️ ${tool.title} (${tool.category})`)
      })
      if (allTools.length > 3) console.log(`   ... y ${allTools.length - 3} más`)

      // Dividir herramientas por tipo
      if (playlistId) {
        // Para páginas de playlist específica, mostrar todos los tools en "Tools"
        setTools({
          recentlyAdded: allTools.slice(0, 4),
          popularTools: allTools, // Todas las herramientas de la playlist
          trendingNow: [], // No usar trending para playlist específicas
        })
      } else {
        // Para página principal, usar distribución normal
        setTools({
          recentlyAdded: allTools.slice(0, 4),
          popularTools: allTools.filter((_, index) => index % 2 === 0).slice(0, 12), // Más herramientas en popular
          trendingNow: [], // Eliminado trending como solicitado
        })
      }
      
      setError(null) // Clear any previous errors
    } catch (error: any) {
      console.warn('Database connection failed, using static data:', error.message)
      // Use static data structure as fallback
      const staticData = getStaticToolsStructure(playlistId)
      setTools(staticData)
      setError(null) // Don't show error, just use fallback data
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