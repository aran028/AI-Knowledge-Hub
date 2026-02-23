"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth.hook"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  readonly children: React.ReactNode
}

// Rutas que no requieren autenticación
const publicRoutes = new Set(['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/callback'])

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || loading) return

    const isPublicRoute = publicRoutes.has(pathname)
    
    // Si no hay usuario y está en una ruta privada, redirigir a login
    if (!user && !isPublicRoute) {
      router.push('/auth/login')
    }

    // Si hay usuario y está en una ruta pública, redirigir a home
    if (user && isPublicRoute) {
      router.push('/')
    }
  }, [user, loading, pathname, router, isClient])

  // Mostrar loading mientras se verifica la autenticación
  if (!isClient || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  const isPublicRoute = publicRoutes.has(pathname)
  
  // Si no hay usuario y está en una ruta privada, mostrar loading (la redirección está en progreso)
  if (!user && !isPublicRoute) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}