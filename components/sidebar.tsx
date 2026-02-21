"use client"

import { useState } from "react"
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Brain,
  Eye,
  Scissors,
  Layers,
  Bot,
  BarChart3,
  Sparkles,
  Gamepad2,
} from "lucide-react"
import type { Playlist } from "@/lib/data"

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="size-4" />,
  eye: <Eye className="size-4" />,
  scissors: <Scissors className="size-4" />,
  layers: <Layers className="size-4" />,
  bot: <Bot className="size-4" />,
  "bar-chart": <BarChart3 className="size-4" />,
  sparkles: <Sparkles className="size-4" />,
  gamepad: <Gamepad2 className="size-4" />,
}

interface SidebarProps {
  playlists: Playlist[]
  activePlaylist: string | null
  onSelectPlaylist: (id: string | null) => void
}

export function Sidebar({ playlists, activePlaylist, onSelectPlaylist }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[72px] flex-col gap-2 p-2 lg:w-[280px]">
      {/* Top nav */}
      <nav className="rounded-lg bg-card p-4">
        <ul className="flex flex-col gap-4">
          <li>
            <button
              onClick={() => onSelectPlaylist(null)}
              className="flex items-center gap-4 text-sm font-bold text-foreground transition-colors hover:text-foreground"
            >
              <Home className="size-6 shrink-0" />
              <span className="hidden lg:inline">Home</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-4 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">
              <Search className="size-6 shrink-0" />
              <span className="hidden lg:inline">Search</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Library */}
      <nav className="flex flex-1 flex-col overflow-hidden rounded-lg bg-card">
        <div className="flex items-center justify-between p-4 pb-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Library className="size-6 shrink-0" />
            <span className="hidden lg:inline">Your Library</span>
          </button>
          <button className="hidden rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:block">
            <Plus className="size-4" />
          </button>
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
                <p className="truncate text-sm font-medium text-foreground">Liked Tools</p>
                <p className="truncate text-xs text-muted-foreground">24 tools</p>
              </div>
            </button>

            {/* Playlists (Subjects) */}
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id === activePlaylist ? null : playlist.id)}
                className={`mb-0.5 flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-accent ${
                  activePlaylist === playlist.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded bg-secondary text-muted-foreground">
                  {iconMap[playlist.icon] || <Layers className="size-4" />}
                </div>
                <div className="hidden min-w-0 lg:block">
                  <p className="truncate text-sm font-medium text-foreground">{playlist.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{playlist.count} tools</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}
