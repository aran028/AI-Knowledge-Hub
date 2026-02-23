"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Library,
  Plus,
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

// Colores vibrantes para cada categoría
const iconColors: Record<string, string> = {
  brain: "bg-gradient-to-br from-purple-500 to-pink-500 text-white",
  code: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white", 
  workflow: "bg-gradient-to-br from-green-500 to-emerald-500 text-white",
  terminal: "bg-gradient-to-br from-gray-600 to-gray-800 text-white",
  palette: "bg-gradient-to-br from-pink-500 to-rose-500 text-white",
  notebook: "bg-gradient-to-br from-orange-500 to-yellow-500 text-white",
  "git-branch": "bg-gradient-to-br from-indigo-500 to-purple-500 text-white",
  server: "bg-gradient-to-br from-red-500 to-pink-500 text-white",
  layers: "bg-gradient-to-br from-teal-500 to-blue-500 text-white",
}

interface SidebarProps {
  playlists: Playlist[]
  activePlaylist: string | null
  onSelectPlaylist: (id: string | null) => void

  onSearch?: (query: string) => void
  searchResults?: string[]
}

export function Sidebar({ playlists, activePlaylist, onSelectPlaylist, onSearch, searchResults = [] }: SidebarProps) {
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
              className={`group flex items-center gap-4 text-xs font-medium rounded-lg p-3 transition-all duration-200 hover:bg-primary/10 hover:scale-105 ${
                pathname === "/" ? "text-foreground bg-primary/20 shadow-lg" : "text-muted-foreground"
              }`}
            >
              <Home className={`size-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                pathname === "/" ? "text-primary" : ""
              }`} />
              <span className="hidden lg:inline">Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/youtube"
              className={`group flex items-center gap-4 text-xs font-medium rounded-lg p-3 transition-all duration-200 hover:bg-red-500/10 hover:scale-105 ${
                pathname === "/youtube" ? "text-foreground bg-red-500/20 shadow-lg" : "text-muted-foreground"
              }`}
            >
              <Youtube className={`size-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                pathname === "/youtube" ? "text-red-500" : ""
              }`} />
              <span className="hidden lg:inline">YouTube</span>
            </Link>
          </li>
          <li>
            <div className="group flex items-center gap-4 rounded-lg p-3 transition-all duration-200 hover:bg-blue-500/10">
              <Search className="size-6 shrink-0 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
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
        </div>

        {isExpanded && (
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {/* Playlists (Subjects) */}
            {playlists.map((playlist) => (
              <div key={playlist.id} className="group relative">
                <button
                  onClick={() => onSelectPlaylist(playlist.id === activePlaylist ? null : playlist.id)}
                  className={`mb-0.5 flex w-full items-center gap-3 rounded-md p-2 text-left transition-all duration-300 hover:bg-accent hover:scale-[1.02] hover:shadow-md ${
                    activePlaylist === playlist.id ? "bg-accent scale-[1.02] shadow-md" : ""
                  } ${
                    searchResults.includes(playlist.id) ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50" : ""
                  }`}
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
                    iconColors[playlist.icon] || "bg-gradient-to-br from-gray-400 to-gray-600 text-white"
                  }`}>
                    {iconMap[playlist.icon] || <Layers className="size-4" />}
                  </div>
                  <div className="hidden min-w-0 lg:block">
                    <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-200">{playlist.name}</p>
                    {playlist.description && (
                      <p className="truncate text-[9px] text-muted-foreground mb-0.5 group-hover:text-foreground transition-colors duration-200">{playlist.description}</p>
                    )}
                    <p className="truncate text-[10px] text-muted-foreground group-hover:text-primary/80 transition-colors duration-200">{playlist.count} tools</p>
                  </div>
                </button>

              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}
