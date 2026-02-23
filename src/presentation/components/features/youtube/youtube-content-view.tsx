"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Calendar, 
  Eye, 
  BarChart3, 
  Grid3X3, 
  List,
  Filter,
  SortAsc,
  SortDesc,
  Play,
  Bot
} from "lucide-react"
import { YouTubeCard } from "./youtube-card"
import { useYouTubeContent, useYouTubeStats } from "@/src/presentation/hooks/use-youtube.hook"
import { usePlaylists } from "@/src/presentation/hooks/use-supabase.hook"
import { YouTubeContent } from "@/shared/config/supabase-auth"

type SortOption = "date" | "views" | "title" | "confidence"
type ViewMode = "grid" | "list"

export function YouTubeContentView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | "all">("all")
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all")

  const { 
    content, 
    loading, 
    error, 
    refetch 
  } = useYouTubeContent(
    selectedPlaylist === "all" ? undefined : selectedPlaylist,
    {
      search: searchQuery,
      minConfidence: confidenceFilter === "high" ? 0.8 : 
                    confidenceFilter === "medium" ? 0.6 : 
                    undefined,
    }
  )

  const { stats } = useYouTubeStats()
  const { playlists } = usePlaylists()

  const sortedContent = useMemo(() => {
    if (!content) return []
    
    const sorted = [...content].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case "date":
          aValue = new Date((a.published_at || a.created_at) as string)
          bValue = new Date((b.published_at || b.created_at) as string)
          break
        case "views":
          aValue = a.view_count || 0
          bValue = b.view_count || 0
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "confidence":
          aValue = a.confidence_score || 0
          bValue = b.confidence_score || 0
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    
    return sorted
  }, [content, sortBy, sortOrder])

  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || isNaN(num)) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getGridClass = () => {
    switch (viewMode) {
      case "list":
        return "grid grid-cols-1 gap-4"
      case "grid":
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton para stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Skeleton para filtros */}
        <div className="flex flex-wrap gap-4">
          <div className="h-9 bg-muted rounded w-64" />
          <div className="h-9 bg-muted rounded w-32" />
          <div className="h-9 bg-muted rounded w-32" />
        </div>
        
        {/* Skeleton para contenido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-5 bg-muted rounded w-16" />
                  <div className="h-5 bg-muted rounded w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Error al cargar el contenido: {error}</p>
        <Button onClick={refetch} className="mt-4">
          Reintentar
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Play className="h-4 w-4 text-red-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Videos</p>
                  <p className="text-2xl font-bold">{stats?.total_videos || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-blue-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Visualizaciones</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats?.confidence_distribution ? (stats.confidence_distribution.high + stats.confidence_distribution.medium + stats.confidence_distribution.low) : 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-green-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Esta semana</p>
                  <p className="text-2xl font-bold">{stats?.recent_videos || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bot className="h-4 w-4 text-purple-500" />
                <div className="ml-2">
                  <p className="text-xs font-medium text-muted-foreground">Confianza promedio</p>
                  <p className="text-2xl font-bold">
                    {Math.round((stats?.average_confidence || 0) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Playlist Filter */}
            <div className="min-w-48">
              <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las playlists</SelectItem>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confidence Filter */}
            <div className="min-w-36">
              <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toda confianza</SelectItem>
                  <SelectItem value="high">Alta (80%+)</SelectItem>
                  <SelectItem value="medium">Media (60%+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="min-w-36">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="views">Visualizaciones</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="confidence">Confianza IA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>

            {/* View Mode */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {sortedContent.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedPlaylist !== "all" || confidenceFilter !== "all" 
              ? "No se encontraron videos con los filtros aplicados."
              : "No hay contenido de YouTube disponible."
            }
          </p>
        </Card>
      ) : (
        <div className={getGridClass()}>
          {sortedContent.map((item) => (
            <YouTubeCard
              key={item.id}
              content={item}
              onContentChange={refetch}
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination could go here if needed */}
    </div>
  )
}