"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Bell, LogOut, Settings, ExternalLink, Sparkles, Brain, Code2, Zap } from "lucide-react"
import { AddToolDialog } from "@/components/features/tools/add-tool-dialog.component"
import { useAuth } from "@/hooks/use-auth.hook"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function GlassHeader({ onToolAdded }: { onToolAdded?: () => void }) {
  const [scrollOpacity, setScrollOpacity] = useState(0)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [showExploreMenu, setShowExploreMenu] = useState(false)
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Sitios interesantes de IA para explorar
  const exploreLinks = [
    {
      name: "Papers With Code",
      url: "https://paperswithcode.com/",
      description: "Últimos papers de investigación en IA",
      icon: <Brain className="size-4" />,
      color: "text-purple-500"
    },
    {
      name: "Hugging Face",
      url: "https://huggingface.co/",
      description: "Modelos y datasets de IA open source",
      icon: <Code2 className="size-4" />,
      color: "text-yellow-500"
    },
    {
      name: "AI News",
      url: "https://www.artificialintelligence-news.com/",
      description: "Últimas noticias del mundo AI",
      icon: <Zap className="size-4" />,
      color: "text-blue-500"
    },
    {
      name: "Product Hunt AI",
      url: "https://www.producthunt.com/topics/artificial-intelligence",
      description: "Nuevos productos de IA cada día",
      icon: <Sparkles className="size-4" />,
      color: "text-pink-500"
    },
    {
      name: "AI Research",
      url: "https://openai.com/research/",
      description: "Investigación de OpenAI",
      icon: <Brain className="size-4" />,
      color: "text-green-500"
    },
    {
      name: "GitHub AI",
      url: "https://github.com/topics/artificial-intelligence",
      description: "Proyectos open source de IA",
      icon: <Code2 className="size-4" />,
      color: "text-gray-500"
    }
  ]

  useEffect(() => {
    const mainContent = document.getElementById("main-scroll")
    if (!mainContent) return

    const handleScroll = () => {
      const scroll = mainContent.scrollTop
      const opacity = Math.min(scroll / 300, 1)
      setScrollOpacity(opacity)
    }

    mainContent.addEventListener("scroll", handleScroll, { passive: true })
    return () => mainContent.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Detectar si se puede navegar hacia atrás/adelante
    const updateNavState = () => {
      setCanGoBack(window.history.length > 1)
      setCanGoForward(false) // Next.js no expone forward history
    }

    updateNavState()
    window.addEventListener('popstate', updateNavState)
    return () => window.removeEventListener('popstate', updateNavState)
  }, [])

  useEffect(() => {
    // Cerrar menú de Explore al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showExploreMenu && !target.closest('.relative')) {
        setShowExploreMenu(false)
      }
    }

    if (showExploreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExploreMenu])

  const handleGoBack = () => {
    if (canGoBack) {
      router.back()
    }
  }

  const handleGoForward = () => {
    // En Next.js no hay router.forward(), pero podemos usar window.history
    window.history.forward()
  }

  const getUserInitials = (email?: string, fullName?: string) => {
    if (fullName) {
      return fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email ? email[0].toUpperCase() : 'U'
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 transition-colors duration-200"
      style={{
        backgroundColor: `rgba(18, 18, 18, ${scrollOpacity * 0.95})`,
        backdropFilter: scrollOpacity > 0.05 ? `blur(${scrollOpacity * 20}px)` : "none",
      }}
    >
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoBack}
          disabled={!canGoBack}
          className={`flex size-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 ${
            canGoBack 
              ? "bg-black/40 text-foreground hover:bg-black/60 cursor-pointer" 
              : "bg-black/20 text-muted-foreground cursor-not-allowed opacity-50"
          }`}
          aria-label="Go back"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={handleGoForward}
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-foreground transition-all duration-200 hover:bg-black/60 hover:scale-110 active:scale-95"
          aria-label="Go forward"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <AddToolDialog onToolAdded={onToolAdded} />
        
        {/* Explore AI Sites Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowExploreMenu(!showExploreMenu)}
            className="rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-1.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="size-3" />
              Explore
            </span>
          </button>
          
          {showExploreMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-card/95 backdrop-blur-md border shadow-2xl z-50">
              <div className="p-3">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="size-4 text-primary" />
                  Discover AI Resources
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {exploreLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowExploreMenu(false)}
                      className="group flex items-start gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02]"
                    >
                      <div className={`flex items-center justify-center ${link.color}`}>
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{link.name}</p>
                          <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-xs text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 Tip: Añade sitios que descubras a tu biblioteca
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <button
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-foreground transition-all duration-200 hover:bg-black/60 hover:scale-110 active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </button>
        
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt="Avatar" />
                <AvatarFallback className="bg-secondary text-xs">
                  {getUserInitials(user?.email, user?.user_metadata?.full_name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || 'Usuario'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
