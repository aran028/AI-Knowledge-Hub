"use client"

import Image from "next/image"
import { Play, Clock, Zap } from "lucide-react"
import type { Tool } from "@/shared/types/data"

interface HeroSectionProps {
  tools: Tool[]
}

export function HeroSection({ tools }: HeroSectionProps) {
  const featured = tools[0]
  if (!featured) return null

  return (
    <section className="relative mb-8 overflow-hidden rounded-lg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-background" />

      <div className="relative px-6 pb-8 pt-16 md:pt-24">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Zap className="size-3" />
          Recently Added
        </div>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          {featured.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          {featured.summary}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            <Play className="size-4 fill-current" />
            Open Tool
          </a>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>Added today</span>
          </div>
        </div>

        {/* Featured cards row */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-md bg-card/60 p-3 backdrop-blur-sm transition-colors hover:bg-accent/80"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{tool.title}</p>
                <p className="truncate text-xs text-muted-foreground">{tool.category}</p>
              </div>
              <button
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 group-hover:shadow-primary/25"
                aria-label={`Open ${tool.title}`}
              >
                <Play className="size-4 fill-current" />
              </button>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
