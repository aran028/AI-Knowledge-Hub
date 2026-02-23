"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar.component"
import { GlassHeader } from "@/components/layout/glass-header.component"
import { HeroSection } from "@/components/layout/hero-section.component"
import { ScrollRow } from "@/components/layout/scroll-row.component"
import { GridView } from "@/components/features/tools/tool-grid.component"
import { YouTubeDashboard } from "@/components/features/youtube/youtube-dashboard"
import { ChatBot } from "@/src/presentation/components/ui/chatbot"
import { usePlaylists, useTools } from "@/src/presentation/hooks/use-supabase.hook"

export default function Home() {
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<{tools: string[], playlists: string[]}>({tools: [], playlists: []})
  
  // Obtener datos de Supabase
  const { playlists, loading: playlistsLoading, error: playlistsError, refetch: refetchPlaylists } = usePlaylists()
  
  const { tools, loading: toolsLoading, error: toolsError, refetch: refetchTools } = useTools(activePlaylist)

  const activeSubject = playlists.find((p) => p.id === activePlaylist)

  // Handler para cuando se modifica una playlist
  const handlePlaylistChanged = () => {
    refetchPlaylists()
    refetchTools()
  }

  // Handler para cuando se modifica una herramienta  
  const handleToolChanged = () => {
    refetchTools()
    refetchPlaylists() // Para actualizar el count de las playlists
  }

  // Handler para búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults({tools: [], playlists: []})
      return
    }
    
    const lowerQuery = query.toLowerCase()
    
    // Buscar en herramientas
    const foundTools = [...tools.recentlyAdded, ...tools.popularTools]
      .filter(tool => 
        tool.title.toLowerCase().includes(lowerQuery) ||
        tool.summary.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .map(tool => tool.id)
    
    // Buscar en playlists
    const foundPlaylists = playlists
      .filter(playlist => 
        playlist.name.toLowerCase().includes(lowerQuery)
      )
      .map(playlist => playlist.id)
    
    setSearchResults({tools: foundTools, playlists: foundPlaylists})
  }

  // Mostrar loading state
  if (playlistsLoading || toolsLoading) {
    return (
      <div className="flex h-screen">
        <div className="fixed left-0 top-0 z-30 flex h-screen w-[72px] flex-col gap-2 p-2 lg:w-[280px]">
          <div className="rounded-lg bg-card p-4">
            <div className="h-6 w-20 animate-pulse rounded bg-muted"></div>
          </div>
          <div className="flex-1 rounded-lg bg-card p-4">
            <div className="h-6 w-24 animate-pulse rounded bg-muted mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
              ))}
            </div>
          </div>
        </div>
        <main className="ml-[72px] flex flex-1 flex-col lg:ml-[280px]">
          <div className="flex-1 p-6 space-y-8">
            <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded bg-muted"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Mostrar error state
  if (playlistsError || toolsError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Error al cargar los datos</h2>
          <p className="text-muted-foreground mb-4">
            {playlistsError || toolsError}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        playlists={playlists}
        activePlaylist={activePlaylist}
        onSelectPlaylist={setActivePlaylist}
        onPlaylistChanged={handlePlaylistChanged}
        onSearch={handleSearch}
        searchResults={searchResults.playlists}
      />

      {/* Main content */}
      <main className="ml-[72px] flex flex-1 flex-col lg:ml-[280px]">
        <div
          id="main-scroll"
          className="custom-scrollbar flex-1 overflow-y-auto"
        >
          <GlassHeader onToolAdded={handleToolChanged} />

          <div className="flex flex-col gap-10 px-6 pb-32">
            {/* Search results indicator */}
            {searchQuery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900">
                  🔍 Resultados de búsqueda para "{searchQuery}"
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {searchResults.tools.length} herramientas y {searchResults.playlists.length} playlists encontradas
                </p>
              </div>
            )}

            {/* Hero Section — only on home */}
            {!activePlaylist && <HeroSection tools={tools.recentlyAdded} />}

            {/* Filtered view title */}
            {activePlaylist && activeSubject && (
              <div className="pt-8">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Subject
                </p>
                <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                  {activeSubject.name}
                </h1>
                {activeSubject.description && (
                  <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
                    {activeSubject.description}
                  </p>
                )}
              </div>
            )}

            {/* Scroll rows - ahora usando GridView para unificar estilo */}
            {tools.popularTools.length > 0 && (
              <GridView
                title={activePlaylist ? "Tools" : "Popular Tools"}
                description={activePlaylist ? activeSubject?.description : undefined}
                tools={tools.popularTools}
                showManagement={true}
                onToolChanged={handleToolChanged}
                highlightedTools={searchResults.tools}
              />
            )}

            {/* YouTube section para páginas de playlist */}
            {activePlaylist && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">YouTube Content</h2>
                <YouTubeDashboard maxItems={8} showHeader={false} />
              </div>
            )}

            {/* YouTube Dashboard — only on home */}
            {!activePlaylist && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">YouTube Content</h2>
                <YouTubeDashboard maxItems={6} />
              </div>
            )}

            {/* Empty state */
            {activePlaylist && tools.popularTools.length === 0 && 
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl text-muted-foreground">?</span>
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  No tools found
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  No tools match this subject yet. Check back soon.
                </p>
              </div>
            }
          </div>
        </div>
        
        {/* ChatBot */}
        <ChatBot 
          pageContent={{
            activePlaylist,
            playlists,
            tools: [...tools.recentlyAdded, ...tools.popularTools],
            searchQuery
          }}
        />
      </main>
    </div>
  )
}
