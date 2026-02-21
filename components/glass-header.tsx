"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Bell, LogOut, Settings } from "lucide-react"
import { AddToolDialog } from "@/components/add-tool-dialog"
import { useAuth } from "@/hooks/use-auth"
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
  const { user, signOut } = useAuth()

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
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-foreground transition-colors hover:bg-black/60"
          aria-label="Go back"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-foreground transition-colors hover:bg-black/60"
          aria-label="Go forward"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <AddToolDialog onToolAdded={onToolAdded} />
        <button className="rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
          Explore
        </button>
        <button
          className="flex size-8 items-center justify-center rounded-full bg-black/40 text-foreground transition-colors hover:bg-black/60"
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
