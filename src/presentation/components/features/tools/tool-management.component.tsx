"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit3, Trash2, Loader2 } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEditTool, useDeleteTool, usePlaylists } from "@/src/presentation/hooks/use-supabase.hook"
import { toast } from "@/components/ui/use-toast"
import type { Tool } from "@/shared/types/data"
import type { DatabasePlaylist } from "@/shared/config/supabase-auth"

interface ToolManagementProps {
  tool: Tool
  onToolChanged?: () => void
}

export function ToolManagement({ tool, onToolChanged }: ToolManagementProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: tool.title,
    summary: tool.summary,
    playlist_id: "",
    image: tool.image,
    url: tool.url,
    tags: Array.isArray(tool.tags) ? tool.tags.join(", ") : "",
  })

  const { playlists } = usePlaylists()
  const { editTool, loading: editLoading } = useEditTool()
  const { deleteTool, loading: deleteLoading } = useDeleteTool()

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updates = {
        title: formData.title,
        summary: formData.summary,
        playlist_id: formData.playlist_id || undefined,
        image: formData.image,
        url: formData.url,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      }

      await editTool(tool.id, updates)

      toast({
        title: "Herramienta actualizada",
        description: "Los cambios se guardaron exitosamente.",
      })

      setEditDialogOpen(false)
      onToolChanged?.()
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTool(tool.id)

      toast({
        title: "Herramienta eliminada",
        description: "La herramienta se eliminó correctamente.",
      })

      setDeleteDialogOpen(false)
      onToolChanged?.()
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la herramienta.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-gray-100 border border-gray-200 bg-white/80"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDropdownOpen(!dropdownOpen)
            }}
          >
            <span className="sr-only">Abrir menú</span>
            <Edit3 className="h-4 w-4 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation()
              setEditDialogOpen(true)
              setDropdownOpen(false)
            }}
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation()
              setDeleteDialogOpen(true)
              setDropdownOpen(false)
            }}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Editar Herramienta</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4"
                onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Nombre</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-summary">Descripción</Label>
              <Textarea
                id="edit-summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-playlist">Categoría</Label>
              <Select value={formData.playlist_id} onValueChange={(value) => setFormData({ ...formData, playlist_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {playlists.map((playlist) => (
                    <SelectItem key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">URL de la imagen</Label>
              <Input
                id="edit-image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (separados por comas)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ai, productivity, development"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar herramienta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La herramienta "{tool.title}" será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}