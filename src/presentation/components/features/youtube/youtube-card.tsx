"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Play, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ExternalLink, 
  MoreVertical,
  Trash2,
  FolderOpen,
  Bot,
  Save,
} from "lucide-react"
import { YouTubeContent } from "@/shared/config/supabase-auth"
import { useManageYouTubeContent } from "@/src/presentation/hooks/use-youtube.hook"
import { usePlaylists } from "@/src/presentation/hooks/use-supabase.hook"
import { toast } from "@/components/ui/use-toast"

interface YouTubeCardProps {
  content: YouTubeContent
  onContentChange?: () => void
  showActions?: boolean
  compact?: boolean
}

export function YouTubeCard({ content, onContentChange, showActions = true, compact = false }: YouTubeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { deleteContent, updatePlaylist, loading } = useManageYouTubeContent()
  const { playlists } = usePlaylists()

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-pink-400"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatDuration = (duration?: string) => {
    if (!duration) return null
    // Asumiendo formato ISO 8601 duration (PT4M13S)
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return duration
    
    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0
    const seconds = match[3] ? parseInt(match[3]) : 0
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatViewCount = (count?: number) => {
    if (!count) return null
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const handleDelete = async () => {
    try {
      await deleteContent(content.id)
      toast({
        title: "Video eliminado",
        description: "El contenido se eliminó correctamente.",
      })
      onContentChange?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el contenido.",
        variant: "destructive",
      })
    }
  }

  const handlePlaylistChange = async (playlistId: string | null) => {
    try {
      await updatePlaylist(content.id, playlistId)
      toast({
        title: "Categoría actualizada",
        description: "El video se movió a la nueva categoría.",
      })
      onContentChange?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría.",
        variant: "destructive",
      })
    }
  }

  const handleSaveToProfile = async () => {
    try {
      // Aquí implementarías la lógica para guardar en profiles
      // Por ahora usamos un placeholder
      toast({
        title: "Guardado en Profiles",
        description: "El contenido se guardó exitosamente en tu perfil.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar en el perfil.",
        variant: "destructive",
      })
    }
  }

  const videoUrl = content.video_url || `https://www.youtube.com/watch?v=${content.video_id}`

  // ── Compact mode (home page) ──────────────────────────────────────
  if (compact) {
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-2.5 shadow-lg">
              <Play className="h-4 w-4 text-white fill-white" />
            </div>
          </div>
          {/* Duration */}
          {formatDuration(content.duration) && (
            <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              {formatDuration(content.duration)}
            </span>
          )}
          {/* Confidence dot */}
          <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white/50 ${getConfidenceColor(content.confidence_score || 0)}`} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1.5 p-3 flex-1">
          {/* Title */}
          <h3 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
            {content.title}
          </h3>

          {/* Channel + date */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="truncate font-medium">{content.channel_name}</span>
            {content.published_at && (
              <span className="shrink-0 ml-1">{new Date(content.published_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>

          {/* AI Summary from N8N */}
          {content.ai_summary && (
            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed border-t border-border pt-1.5 mt-0.5">
              {content.ai_summary}
            </p>
          )}

          {/* Related tools from N8N */}
          {content.related_tools && content.related_tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {content.related_tools.slice(0, 3).map((tool) => (
                <span key={tool} className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                  {tool}
                </span>
              ))}
              {content.related_tools.length > 3 && (
                <span className="text-[9px] text-muted-foreground">+{content.related_tools.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </a>
    )
  }

  // ── Full mode (youtube page) ───────────────────────────────────────
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {/* Thumbnail con overlay de play */}
        <a
          href={content.video_url || `https://www.youtube.com/watch?v=${content.video_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-video bg-muted overflow-hidden">
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-3 shadow-lg">
                <Play className="h-5 w-5 text-white fill-white" />
              </div>
            </div>
          
          {/* Duration badge */}
          {formatDuration(content.duration) && (
            <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatDuration(content.duration)}
            </Badge>
          )}

          {/* Confidence score */}
          <div className="absolute top-2 right-2">
            <div className={`w-2 h-2 rounded-full ${getConfidenceColor(content.confidence_score || 0)}`} />
          </div>
        </div>
        </a>

        {/* Actions dropdown - only shown when showActions=true */}
        {showActions && (
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href={content.video_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir en YouTube
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <Bot className="h-4 w-4 mr-2" />
                {isExpanded ? 'Ocultar' : 'Ver'} análisis IA
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleSaveToProfile}>
                <Save className="h-4 w-4 mr-2" />
                Guardar en Profiles
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Submenú para cambiar playlist */}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Mover a categoría
                <DropdownMenu>
                  <DropdownMenuContent side="right" align="start">
                    <DropdownMenuItem onClick={() => handlePlaylistChange(null)}>
                      Sin categoría
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {playlists.map((playlist) => (
                      <DropdownMenuItem 
                        key={playlist.id}
                        onClick={() => handlePlaylistChange(playlist.id)}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Title and channel */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
            <a
              href={content.video_url || `https://www.youtube.com/watch?v=${content.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
            >
              {content.title}
            </a>
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="truncate">{content.channel_name}</span>
            {content.published_at && (
              <span>
                {new Date(content.published_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          {content.view_count && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViewCount(content.view_count)}
            </div>
          )}
          {content.like_count && (
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {formatViewCount(content.like_count)}
            </div>
          )}
        </div>

        {/* Category and tools */}
        <div className="flex flex-wrap gap-1 mt-3">
          {content.playlist && (
            <Badge variant="outline" className="text-xs">
              {content.playlist.name}
            </Badge>
          )}
          {content.related_tools.slice(0, 2).map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs">
              {tool}
            </Badge>
          ))}
          {content.related_tools.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{content.related_tools.length - 2}
            </Badge>
          )}
        </div>

        {/* AI Analysis (expandible) */}
        {isExpanded && (
          <div className="mt-4 p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Análisis IA</span>
              <Badge variant="outline" className="text-xs">
                {Math.round((content.confidence_score || 0) * 100)}% confianza
              </Badge>
            </div>
            
            {content.ai_summary && (
              <p className="text-xs text-muted-foreground">{content.ai_summary}</p>
            )}
            
            {content.ai_key_points && content.ai_key_points.length > 0 && (
              <div>
                <span className="text-xs font-medium">Puntos clave:</span>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  {content.ai_key_points.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}