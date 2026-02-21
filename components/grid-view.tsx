"use client"

import { ToolCard } from "@/components/tool-card"
import type { Tool } from "@/lib/data"

interface GridViewProps {
  title: string
  tools: Tool[]
}

export function GridView({ title, tools }: GridViewProps) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}
