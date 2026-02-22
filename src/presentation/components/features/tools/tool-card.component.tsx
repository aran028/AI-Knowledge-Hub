"use client"

import { Play } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DynamicImage } from "@/src/presentation/components/ui/dynamic-image"
import { ToolManagement } from "./tool-management.component"
import type { Tool } from "@/shared/types/data"

interface ToolCardProps {
  tool: Tool
  variant?: "default" | "hero"
  showManagement?: boolean
  onToolChanged?: () => void
  isHighlighted?: boolean
}

export function ToolCard({ tool, variant = "default", showManagement = false, onToolChanged, isHighlighted = false }: ToolCardProps) {
  const isHero = variant === "hero"
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`group relative flex flex-col overflow-hidden rounded-lg bg-card p-4 transition-all duration-300 hover:bg-accent w-full ${
            isHighlighted ? "ring-2 ring-blue-500 ring-opacity-70 bg-blue-50 shadow-lg" : ""
          }`}>
            {/* Management controls */}
            {showManagement && (
              <div className="absolute top-2 right-2 z-50 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border">
                <ToolManagement tool={tool} onToolChanged={onToolChanged} />
              </div>
            )}
            
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="contents"
            >
            {/* Image */}
            <div className="relative mb-4 overflow-hidden rounded-md shadow-lg shadow-black/40 aspect-square">
              <DynamicImage
                src={tool.image}
                alt={tool.title}
                title={tool.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 200px, 240px"
              />
              {/* Play button overlay */}
              <button
                className="absolute bottom-2 right-2 flex size-10 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-xl transition-all duration-300 hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100"
                aria-label={`Open ${tool.title}`}
              >
                <Play className="size-4 fill-current" />
              </button>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-foreground text-sm">
                {tool.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
                {tool.summary}
              </p>
              {isHero && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tool.tags.map((tag: string) => (
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
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-card border border-border shadow-lg">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-foreground">{tool.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{tool.summary}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
