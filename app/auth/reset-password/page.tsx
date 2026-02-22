"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Lock, CheckCircle, AlertTriangle, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/src/presentation/hooks/use-auth.hook"
import Link from "next/link"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const { updatePassword } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Verificar si hay errores en la URL
  const urlError = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')

  useEffect(() => {
    // Si hay errores en la URL, mostrarlos
    if (urlError) {
      if (errorCode === 'otp_expired' || errorDescription?.includes('expired')) {
        setError('El enlace de restablecimiento ha expirado. Solicita un nuevo enlace.')
      } else if (errorDescription?.includes('invalid')) {
        setError('El enlace de restablecimiento no es válido. Solicita un nuevo enlace.')
      } else {
        setError(decodeURIComponent(errorDescription || 'Error al restablecer la contraseña.'))
      }
    }
  }, [urlError, errorCode, errorDescription])

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validaciones
    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    try {
      const { error } = await updatePassword(newPassword)
      if (error) {
        if (error.message.includes('session_not_found')) {
          setError('Sesión expirada. Por favor, solicita un nuevo enlace de restablecimiento.')
        } else {
          setError(error.message)
        }
      } else {
        setSuccess(true)
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    } catch (err: any) {
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Estado de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">¡Contraseña Actualizada!</CardTitle>
            <CardDescription>
              Tu contraseña se ha restablecido exitosamente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Serás redirigido al login automáticamente...
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/auth/login" className="w-full">
              <Button className="w-full">
                Ir al Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Estado de error (enlace expirado/inválido)
  if (urlError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Enlace No Válido</CardTitle>
            <CardDescription>
              El enlace de restablecimiento ha expirado o no es válido
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mx-auto">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <Alert className="mb-4 text-left">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground mb-4">
              Los enlaces de restablecimiento son válidos por un tiempo limitado por seguridad.
            </p>
          </CardContent>
          <CardFooter className="space-y-2">
            <Link href="/auth/forgot-password" className="w-full">
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Solicitar Nuevo Enlace
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Formulario para nueva contraseña
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Nueva Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para tu cuenta
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo 6 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Contraseña
            </Button>
            <Link href="/auth/login" className="w-full">
              <Button type="button" variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}