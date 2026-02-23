"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Youtube, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Play,
  Bot
} from "lucide-react"
import { useYouTubeContent, useYouTubeStats } from "@/src/presentation/hooks/use-youtube.hook"
import { usePlaylists } from "@/src/presentation/hooks/use-supabase.hook"
import { YouTubeCard } from "./youtube-card"
import { YouTubeSetupGuide } from "./youtube-setup-guide"
import { YouTubeContent } from "@/shared/config/supabase-auth"

interface YouTubeDashboardProps {
  maxItems?: number
  showHeader?: boolean
  className?: string
  playlistId?: string | null
  compact?: boolean
}

export function YouTubeDashboard({ 
  maxItems = 6, 
  showHeader = true, 
  className = "",
  playlistId = null,
  compact = false,
}: YouTubeDashboardProps) {
  const { content, loading } = useYouTubeContent(playlistId ?? undefined, {
    limit: maxItems,
  })
  
  const { stats } = useYouTubeStats()

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Youtube className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-semibold">Contenido de YouTube</h2>
            </div>
            <div className="h-9 w-24 bg-muted rounded animate-pulse" />
          </div>
        )}

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-6 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content skeleton */}
        <div className={compact
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }>
          {[...Array(maxItems)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Youtube className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-semibold">Contenido de YouTube</h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/youtube" className="flex items-center gap-2">
              Ver todo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Videos totales</p>
                  <p className="text-2xl font-bold">{stats?.total_videos || 0}</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Añadidos reciente</p>
                  <p className="text-2xl font-bold">{stats?.recent_videos || 0}</p>
                </div>
                <Clock className="h-8 w-8" style={{ color: '#F875AA' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confianza IA</p>
                  <p className="text-2xl font-bold">
                    {Math.round((stats?.average_confidence || 0) * 100)}%
                    {(stats?.average_confidence || 0) >= 0.8 && (
                      <TrendingUp className="h-4 w-4 inline ml-2" style={{ color: '#F875AA' }} />
                    )}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Content */}
      {content && content.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Videos recientes</h3>
            {content.length === maxItems && (
              <Link href="/youtube">
                <Button variant="outline" size="sm">
                  Ver más
                </Button>
              </Link>
            )}
          </div>

          <div className={compact
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          }>
            {content.slice(0, maxItems).map((item: YouTubeContent) => (
              <YouTubeCard key={item.id} content={item} showActions={!compact} compact={compact} />
            ))}
          </div>
        </div>
      ) : (
        <YouTubeSetupGuide />
      )}
    </div>
  )
}