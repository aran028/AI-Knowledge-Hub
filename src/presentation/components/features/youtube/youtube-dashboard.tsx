"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Youtube, 
  TrendingUp, 
  Clock, 
  Eye,
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
}

export function YouTubeDashboard({ 
  maxItems = 6, 
  showHeader = true, 
  className = "",
  playlistId = null
}: YouTubeDashboardProps) {
  const { content, loading } = useYouTubeContent(playlistId ?? undefined, {
    limit: maxItems,
  })
  
  const { stats } = useYouTubeStats()

  const formatNumber = (num?: number) => {
    if (!num || typeof num !== 'number' || isNaN(num)) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <p className="text-2xl font-bold">{stats?.totalVideos || 0}</p>
                </div>
                <Play className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Visualizaciones</p>
                  <p className="text-2xl font-bold">{formatNumber(stats?.totalViews)}</p>
                </div>
                <Eye className="h-8 w-8" style={{ color: '#F875AA' }} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Esta semana</p>
                  <p className="text-2xl font-bold">
                    {stats?.videosThisWeek || 0}
                    {(stats?.videosThisWeek || 0) > 0 && (
                      <TrendingUp className="h-4 w-4 inline ml-2" style={{ color: '#F875AA' }} />
                    )}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.slice(0, maxItems).map((item: YouTubeContent) => (
              <YouTubeCard key={item.id} content={item} />
            ))}
          </div>
        </div>
      ) : (
        <YouTubeSetupGuide />
      )}
    </div>
  )
}