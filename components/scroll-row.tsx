"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ToolCard } from "@/components/tool-card"
import type { Tool } from "@/lib/data"

interface ScrollRowProps {
  title: string
  tools: Tool[]
  variant?: "default" | "hero"
}

export function ScrollRow({ title, tools, variant = "default" }: ScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const scrollAmount = direction === "left" ? -400 : 400
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  return (
    <section className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex size-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
      >
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} variant={variant} />
        ))}
      </div>
    </section>
  )
}
