"use client"

import { useState, useEffect } from "react"
import { Play, ChevronLeft, ChevronRight, Zap, ExternalLink } from "lucide-react"
import type { Tool } from "@/shared/types/data"

interface HeroSectionProps {
  tools: Tool[]
}

export function HeroSection({ tools }: HeroSectionProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (tools.length <= 1) return
    const timer = setInterval(() => {
      goTo((current + 1) % tools.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current, tools.length])

  if (!tools.length) return null

  const goTo = (index: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 200)
  }

  const featured = tools[current]

  return (
    <section className="relative mb-2 overflow-hidden rounded-xl border border-border bg-card">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative px-8 pb-8 pt-10">
        {/* Label */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-5">
          <Zap className="size-3" />
          Recently Added
        </div>

        {/* Slide content */}
        <div
          className="transition-opacity duration-200"
          style={{ opacity: animating ? 0 : 1 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <span className="inline-block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 bg-muted px-2 py-0.5 rounded">
                {featured.category}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight">
                {featured.title}
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {featured.summary}
              </p>
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                >
                  <Play className="size-3.5 fill-current" />
                  Open Tool
                </a>
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  Visit site
                </a>
                {featured.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {tools.length > 1 && (
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => goTo((current - 1 + tools.length) % tools.length)}
              className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {tools.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((current + 1) % tools.length)}
              className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </button>

            <span className="ml-2 text-xs text-muted-foreground">
              {current + 1} / {tools.length}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
