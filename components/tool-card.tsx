"use client"

import { Play } from "lucide-react"
import Image from "next/image"
import type { Tool } from "@/lib/data"

interface ToolCardProps {
  tool: Tool
  variant?: "default" | "hero"
}

export function ToolCard({ tool, variant = "default" }: ToolCardProps) {
  const isHero = variant === "hero"

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative flex flex-col overflow-hidden rounded-lg bg-card p-4 transition-all duration-300 hover:bg-accent ${
        isHero ? "min-w-[280px] md:min-w-[340px]" : "min-w-[180px] md:min-w-[200px]"
      }`}
    >
      {/* Image */}
      <div className={`relative mb-4 overflow-hidden rounded-md shadow-lg shadow-black/40 ${
        isHero ? "aspect-square" : "aspect-square"
      }`}>
        <Image
          src={tool.image}
          alt={tool.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={isHero ? "(max-width: 768px) 280px, 340px" : "(max-width: 768px) 180px, 200px"}
        />
        {/* Play button overlay */}
        <button
          className="absolute bottom-2 right-2 flex size-12 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition-all duration-300 hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Open ${tool.title}`}
        >
          <Play className="size-5 fill-current" />
        </button>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className={`truncate font-semibold text-foreground ${isHero ? "text-base" : "text-sm"}`}>
          {tool.title}
        </h3>
        <p className={`mt-1 line-clamp-2 text-muted-foreground ${isHero ? "text-sm" : "text-xs"}`}>
          {tool.summary}
        </p>
        {isHero && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
