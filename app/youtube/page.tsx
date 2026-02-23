import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { YouTubeContentView } from "@/components/features/youtube/youtube-content-view"

export const metadata: Metadata = {
  title: "Contenido de YouTube - AI Knowledge Hub",
  description: "Explora contenido de YouTube clasificado con IA relacionado con herramientas de IA y tecnología.",
}

export default function YouTubePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: back + title */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Inicio
              </Link>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold leading-none">YouTube Hub</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Videos clasificados automáticamente con IA
                  </p>
                </div>
              </div>
            </div>

            {/* Right: status chips */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Auto-sync activo
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
                N8N · AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <YouTubeContentView />
      </div>
    </div>
  )
}