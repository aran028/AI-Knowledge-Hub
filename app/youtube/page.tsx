import { Metadata } from "next"
import { YouTubeContentView } from "@/components/features/youtube/youtube-content-view"

export const metadata: Metadata = {
  title: "Contenido de YouTube - AI Knowledge Hub",
  description: "Explora contenido de YouTube clasificado con IA relacionado con herramientas de IA y tecnología.",
}

export default function YouTubePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-rose-600">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-20 -left-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 right-1/3 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative container mx-auto px-6 py-12 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* YouTube icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    YouTube Hub
                  </h1>
                  <span className="hidden md:inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    Auto-sync activo
                  </span>
                </div>
                <p className="text-red-100 text-sm md:text-base max-w-xl">
                  Videos de IA descubiertos y clasificados automáticamente por N8N + inteligencia artificial
                </p>
              </div>
            </div>

            {/* Right side chips */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-24">
                <p className="text-2xl font-bold leading-none">∞</p>
                <p className="text-xs text-red-100 mt-1">Actualización</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-24">
                <p className="text-2xl font-bold leading-none">N8N</p>
                <p className="text-xs text-red-100 mt-1">Automatizado</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 text-white text-center min-w-24">
                <p className="text-2xl font-bold leading-none">AI</p>
                <p className="text-xs text-red-100 mt-1">Clasificado</p>
              </div>
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