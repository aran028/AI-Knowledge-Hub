"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlassHeader } from "@/components/glass-header"
import { HeroSection } from "@/components/hero-section"
import { ScrollRow } from "@/components/scroll-row"
import { GridView } from "@/components/grid-view"
import { usePlaylists, useTools } from "@/hooks/use-supabase"

export default function Home() {
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null)
  
  // Obtener datos de Supabase
  const { playlists, loading: playlistsLoading, error: playlistsError } = usePlaylists()
  
  const { tools, loading: toolsLoading, error: toolsError } = useTools(activePlaylist)

  const activeSubject = playlists.find((p) => p.id === activePlaylist)

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
      />

      {/* Main content */}
      <main className="ml-[72px] flex flex-1 flex-col lg:ml-[280px]">
        <div
          id="main-scroll"
          className="custom-scrollbar flex-1 overflow-y-auto"
        >
          <GlassHeader onToolAdded={() => {
            // Recargar datos cuando se agregue una nueva herramienta
            window.location.reload()
          }} />

          <div className="flex flex-col gap-10 px-6 pb-32">
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
              </div>
            )}

            {/* Scroll rows */}
            {tools.popularTools.length > 0 && (
              <ScrollRow
                title={activePlaylist ? "Tools" : "Popular Tools"}
                tools={tools.popularTools}
              />
            )}

            {tools.trendingNow.length > 0 && (
              <ScrollRow
                title={activePlaylist ? "Trending" : "Trending Now"}
                tools={tools.trendingNow}
              />
            )}

            {tools.myProjects.length > 0 && (
              <GridView
                title={activePlaylist ? "Your Projects" : "My Projects"}
                tools={tools.myProjects}
              />
            )}

            {/* Empty state */}
            {activePlaylist &&
              tools.popularTools.length === 0 &&
              tools.trendingNow.length === 0 &&
              tools.myProjects.length === 0 && (
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
              )}
          </div>
        </div>
      </main>
    </div>
  )
}
