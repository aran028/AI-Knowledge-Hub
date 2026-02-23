"use client"

import Link from "next/link"
import {
  Brain,
  Code,
  Workflow,
  Terminal,
  Palette,
  BookOpen,
  GitBranch,
  Server,
  Layers,
  Bot,
  Eye,
  Scissors,
  BarChart2,
  Sparkles,
  Gamepad2,
  ChevronRight,
} from "lucide-react"
import type { Playlist } from "@/shared/types/data"

const iconMap: Record<string, React.ReactNode> = {
  brain: <Brain className="size-6" />,
  code: <Code className="size-6" />,
  workflow: <Workflow className="size-6" />,
  terminal: <Terminal className="size-6" />,
  palette: <Palette className="size-6" />,
  notebook: <BookOpen className="size-6" />,
  "git-branch": <GitBranch className="size-6" />,
  server: <Server className="size-6" />,
  layers: <Layers className="size-6" />,
  bot: <Bot className="size-6" />,
  eye: <Eye className="size-6" />,
  scissors: <Scissors className="size-6" />,
  "bar-chart": <BarChart2 className="size-6" />,
  sparkles: <Sparkles className="size-6" />,
  gamepad: <Gamepad2 className="size-6" />,
}

const iconColors: Record<string, string> = {
  brain: "bg-gradient-to-br from-purple-500 to-pink-500",
  code: "bg-gradient-to-br from-blue-500 to-cyan-500",
  workflow: "bg-gradient-to-br from-green-500 to-emerald-500",
  terminal: "bg-gradient-to-br from-gray-600 to-gray-800",
  palette: "bg-gradient-to-br from-pink-500 to-rose-500",
  notebook: "bg-gradient-to-br from-orange-500 to-yellow-500",
  "git-branch": "bg-gradient-to-br from-indigo-500 to-purple-500",
  server: "bg-gradient-to-br from-red-500 to-pink-500",
  layers: "bg-gradient-to-br from-teal-500 to-blue-500",
  bot: "bg-gradient-to-br from-violet-500 to-indigo-500",
  eye: "bg-gradient-to-br from-sky-500 to-blue-600",
  scissors: "bg-gradient-to-br from-rose-400 to-pink-600",
  "bar-chart": "bg-gradient-to-br from-amber-500 to-orange-500",
  sparkles: "bg-gradient-to-br from-yellow-400 to-amber-500",
  gamepad: "bg-gradient-to-br from-emerald-500 to-teal-600",
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, "a")
    .replace(/[éèëê]/g, "e")
    .replace(/[íìïî]/g, "i")
    .replace(/[óòöô]/g, "o")
    .replace(/[úùüû]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface PlaylistCardsProps {
  playlists: Playlist[]
}

export function PlaylistCards({ playlists }: PlaylistCardsProps) {
  if (!playlists.length) return null

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">Playlists</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Explora las colecciones de herramientas por categoría
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {playlists.map((playlist) => {
          const slug = nameToSlug(playlist.name)
          const colorClass = iconColors[playlist.icon] || "bg-gradient-to-br from-gray-500 to-gray-700"
          const icon = iconMap[playlist.icon] || <Layers className="size-6" />

          return (
            <Link
              key={playlist.id}
              href={`/${slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:bg-accent hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div
                className={`flex size-12 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-110 ${colorClass}`}
              >
                {icon}
              </div>

              {/* Name */}
              <div className="w-full">
                <p className="text-sm font-semibold text-foreground leading-tight line-clamp-2">
                  {playlist.name}
                </p>
                {playlist.count > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {playlist.count} tools
                  </p>
                )}
              </div>

              {/* Arrow on hover */}
              <ChevronRight className="size-3.5 text-muted-foreground/0 transition-all group-hover:text-primary group-hover:text-muted-foreground" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}
