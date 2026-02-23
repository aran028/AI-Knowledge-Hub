"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit3, Trash2, Loader2, Settings } from "lucide-react"
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
import { useAddPlaylist, useEditPlaylist, useDeletePlaylist } from "@/src/presentation/hooks/use-supabase.hook"
import { toast } from "@/components/ui/use-toast"
import type { Playlist } from "@/shared/types/data"

interface PlaylistManagementProps {
  readonly playlist?: Playlist
  readonly playlists?: Playlist[]
  readonly onPlaylistChanged?: () => void
  readonly mode?: "add" | "edit"
  readonly children?: React.ReactNode
}

const iconOptions = [
  { value: "brain", label: "🧠 Brain", icon: "brain" },
  { value: "code", label: "💻 Code", icon: "code" },
  { value: "workflow", label: "⚡ Workflow", icon: "workflow" },
  { value: "terminal", label: "📟 Terminal", icon: "terminal" },
  { value: "palette", label: "🎨 Palette", icon: "palette" },
  { value: "notebook", label: "📚 Notebook", icon: "notebook" },
  { value: "git-branch", label: "🔀 Git", icon: "git-branch" },
  { value: "server", label: "🖥️ Server", icon: "server" },
  { value: "layers", label: "📋 Layers", icon: "layers" },
]

export function PlaylistManagement({ playlist, playlists = [], onPlaylistChanged, mode = "edit" }: PlaylistManagementProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: playlist?.name || "",
    description: playlist?.description || "",
    icon: playlist?.icon || "layers",
  })

  const { addPlaylist, loading: addLoading } = useAddPlaylist()
  const { editPlaylist, loading: editLoading } = useEditPlaylist()
  const { deletePlaylist, loading: deleteLoading } = useDeletePlaylist()

  const resetForm = () => {
    setFormData({
      name: playlist?.name || "",
      description: playlist?.description || "",
      icon: playlist?.icon || "layers",
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la playlist es requerido.",
          variant: "destructive",
        })
        return
      }

      // Verificar que no exista una playlist con el mismo nombre
      const existingPlaylist = playlists.find(
        p => p.name.toLowerCase() === formData.name.toLowerCase()
      )
      
      if (existingPlaylist) {
        toast({
          title: "Error",
          description: "Ya existe una playlist con ese nombre.",
          variant: "destructive",
        })
        return
      }

      await addPlaylist({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon,
        count: 0,
      })

      toast({
        title: "Playlist creada",
        description: "La nueva playlist se creó exitosamente.",
      })

      setAddDialogOpen(false)
      resetForm()
      onPlaylistChanged?.()
    } catch (error: any) {
      toast({
        title: "Error al crear playlist",
        description: error.message || "No se pudo crear la playlist.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playlist) return

    try {
      if (!formData.name.trim()) {
        toast({
          title: "Error",
          description: "El nombre de la playlist es requerido.",
          variant: "destructive",
        })
        return
      }

      // Verificar que no exista una playlist con el mismo nombre (excluyendo la actual)
      const existingPlaylist = playlists.find(
        p => p.name.toLowerCase() === formData.name.toLowerCase() && p.id !== playlist.id
      )
      
      if (existingPlaylist) {
        toast({
          title: "Error",
          description: "Ya existe una playlist con ese nombre.",
          variant: "destructive",
        })
        return
      }

      await editPlaylist(playlist.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        icon: formData.icon,
      })

      toast({
        title: "Playlist actualizada",
        description: "Los cambios se guardaron exitosamente.",
      })

      setEditDialogOpen(false)
      onPlaylistChanged?.()
    } catch (error: any) {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudieron guardar los cambios.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!playlist) return

    try {
      await deletePlaylist(playlist.id)

      toast({
        title: "Playlist eliminada",
        description: "La playlist se eliminó correctamente.",
      })

      setDeleteDialogOpen(false)
      onPlaylistChanged?.()
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la playlist.",
        variant: "destructive",
      })
    }
  }

  if (mode === "add") {
    return (
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 text-white hover:text-white">
              <Plus className="h-4 w-4" />
              Nueva Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Playlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Nombre</Label>
                <Input
                  id="add-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre de la playlist"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-description">Descripción</Label>
                <Input
                  id="add-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción breve de la playlist"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-icon">Icono</Label>
                <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar icono" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addLoading}>
                  {addLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Playlist
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => { resetForm(); setEditDialogOpen(true); }}>
            <Edit3 className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Playlist</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción breve de la playlist"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">Icono</Label>
              <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar icono" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <AlertDialogTitle>¿Eliminar playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La playlist "{playlist?.name}" será eliminada permanentemente.
              {playlist?.count && playlist.count > 0 && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ Esta playlist contiene {playlist.count} herramientas. No se puede eliminar hasta que esté vacía.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteLoading || (playlist?.count && playlist.count > 0)}
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