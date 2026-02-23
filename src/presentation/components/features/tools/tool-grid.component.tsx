"use client"

import { ToolCard } from "@/src/presentation/components/features/tools/tool-card.component"
import type { Tool } from "@/shared/types/data"

interface GridViewProps {
  title: string
  description?: string
  tools: Tool[]
  showManagement?: boolean
  onToolChanged?: () => void
  highlightedTools?: string[]
}

export function GridView({ title, description, tools, showManagement = false, onToolChanged, highlightedTools = [] }: GridViewProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground md:text-2xl">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            showManagement={showManagement}
            onToolChanged={onToolChanged}
            isHighlighted={highlightedTools.includes(tool.id)}
          />
        ))}
      </div>
    </section>
  )
}
