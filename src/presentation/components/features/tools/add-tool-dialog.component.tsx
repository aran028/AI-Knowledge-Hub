"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { useAddTool, usePlaylists } from "@/src/presentation/hooks/use-supabase.hook"
import { toast } from "@/components/ui/use-toast"
import { Playlist } from "@/shared/types/data"

export function AddToolDialog({ onToolAdded }: { onToolAdded?: () => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    playlist_id: "",
    image: "",
    url: "",
    tags: "",
  })

  const { playlists } = usePlaylists()
  const { addTool, loading } = useAddTool()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await addTool({
        title: formData.title,
        summary: formData.summary,
        playlist_id: formData.playlist_id,
        image: formData.image,
        url: formData.url,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      })

      toast({
        title: "Herramienta agregada",
        description: "La herramienta se agregó exitosamente a la base de datos.",
      })

      setFormData({
        title: "",
        summary: "",
        playlist_id: "",
        image: "",
        url: "",
        tags: "",
      })

      setOpen(false)
      onToolAdded?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la herramienta. Intenta de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 w-8 p-0 rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Herramienta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nombre de la herramienta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Descripción</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Descripción breve de la herramienta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select 
              value={formData.playlist_id} 
              onValueChange={(value) => setFormData({ ...formData, playlist_id: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {playlists.map((playlist: Playlist) => (
                  <SelectItem key={playlist.id} value={playlist.id}>
                    {playlist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://ejemplo.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagen (URL)</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/images/categoria.jpg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por coma)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}