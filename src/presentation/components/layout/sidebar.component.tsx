"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Brain,
  Code,
  Workflow,
  Terminal,
  Palette,
  BookOpen,
  GitBranch,
  Server,
  Layers,
  Youtube,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Playlist } from "@/shared/types/data"
import { PlaylistManagement } from "../features/playlists/playlist-management.component"

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="size-4" />,
  code: <Code className="size-4" />,
  workflow: <Workflow className="size-4" />,
  terminal: <Terminal className="size-4" />,
  palette: <Palette className="size-4" />,
  notebook: <BookOpen className="size-4" />,
  "git-branch": <GitBranch className="size-4" />,
  server: <Server className="size-4" />,
  layers: <Layers className="size-4" />,
}

interface SidebarProps {
  playlists: Playlist[]
  activePlaylist: string | null
  onSelectPlaylist: (id: string | null) => void
  onPlaylistChanged?: () => void
  onSearch?: (query: string) => void
  searchResults?: string[]
}

export function Sidebar({ playlists, activePlaylist, onSelectPlaylist, onPlaylistChanged, onSearch, searchResults = [] }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const clearSearch = () => {
    setSearchQuery("")
    onSearch?.("")
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[72px] flex-col gap-2 p-2 lg:w-[280px]">
      {/* Top nav */}
      <nav className="rounded-lg bg-card p-4">
        <ul className="flex flex-col gap-4">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-4 text-xs font-medium transition-colors hover:text-foreground ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Home className="size-6 shrink-0" />
              <span className="hidden lg:inline">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/youtube"
              className={`flex items-center gap-4 text-xs font-medium transition-colors hover:text-foreground ${
                pathname === "/youtube" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Youtube className="size-6 shrink-0" />
              <span className="hidden lg:inline">YouTube</span>
            </Link>
          </li>
          <li>
            <div className="flex items-center gap-4">
              <Search className="size-6 shrink-0 text-muted-foreground" />
              <div className="hidden lg:flex flex-1 relative">
                <Input
                  placeholder="Buscar tools y playlists..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="text-xs h-8 pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </li>
        </ul>
      </nav>

      {/* Library */}
      <nav className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
        <div className="flex items-center justify-between p-4 pb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Library className="size-6 shrink-0" />
            <span className="hidden lg:inline">Your Library</span>
          </button>
          <PlaylistManagement mode="add" onPlaylistChanged={onPlaylistChanged}>
            <button className="hidden rounded-full p-1 text-white transition-colors hover:bg-accent hover:text-white lg:block">
              <Plus className="size-4" />
            </button>
          </PlaylistManagement>
        </div>

        {isExpanded && (
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {/* Liked Tools */}
            <button
              className="mb-1 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#450AF5] to-[#C4EFD9] lg:size-12">
                <Heart className="size-4 text-foreground" fill="currentColor" />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="truncate text-xs font-medium text-foreground">Liked Tools</p>
                <p className="truncate text-[10px] text-muted-foreground">24 tools</p>
              </div>
            </button>

            {/* Playlists (Subjects) */}
            {playlists.map((playlist) => (
              <div key={playlist.id} className="group relative">
                <button
                  onClick={() => onSelectPlaylist(playlist.id === activePlaylist ? null : playlist.id)}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent ${
                    activePlaylist === playlist.id ? "bg-accent" : ""
                  } ${
                    searchResults.includes(playlist.id) ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50" : ""
                  }`}
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded bg-secondary text-muted-foreground">
                    {iconMap[playlist.icon] || <Layers className="size-4" />}
                  </div>
                  <div className="hidden min-w-0 lg:block">
                    <p className="truncate text-xs font-medium text-foreground">{playlist.name}</p>
                    {playlist.description && (
                      <p className="truncate text-[9px] text-muted-foreground mb-0.5">{playlist.description}</p>
                    )}
                    <p className="truncate text-[10px] text-muted-foreground">{playlist.count} tools</p>
                  </div>
                </button>
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlaylistManagement 
                    mode="edit" 
                    playlist={playlist} 
                    onPlaylistChanged={onPlaylistChanged}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}
