import { Metadata } from "next"
import { YouTubeContentView } from "@/components/features/youtube/youtube-content-view"

export const metadata: Metadata = {
  title: "Contenido de YouTube - AI Knowledge Hub",
  description: "Explora contenido de YouTube clasificado con IA relacionado con herramientas de IA y tecnología.",
}

export default function YouTubePage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Contenido de YouTube
          </h1>
          <p className="text-muted-foreground">
            Descubre videos relacionados con herramientas de IA clasificados automáticamente por nuestro sistema inteligente.
          </p>
        </div>

        {/* YouTube Content View */}
        <YouTubeContentView />
      </div>
    </div>
  )
}