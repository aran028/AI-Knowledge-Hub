"use client"

import Image from "next/image"
import { useState } from "react"

interface DynamicImageProps {
  src: string
  alt: string
  title: string
  className?: string
  fill?: boolean
  sizes?: string
}

// Función para generar un color basado en el título (mejorada)
function generateColor(title: string): string {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-pink-400 to-pink-500', 
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600'
  ]
  
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Función para extraer iniciales del título
function getInitials(title: string): string {
  return title
    .split(' ')
    .filter(word => word.length > 0)
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
}

export function DynamicImage({ 
  src, 
  alt, 
  title, 
  className = "", 
  fill = false, 
  sizes 
}: DynamicImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null)

  // Intentar generar imagen automáticamente si falla
  const handleImageError = () => {
    if (!fallbackSrc && title) {
      // Generar URL de fallback inteligente
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '')
      const smartFallback = `https://api.dicebear.com/7.x/identicon/png?seed=${encodeURIComponent(cleanTitle)}&backgroundColor=6366f1&size=400`
      setFallbackSrc(smartFallback)
    } else {
      setImageError(true)
    }
  }

  // Si la imagen falla o no existe, mostrar un avatar generado
  if (imageError || !src) {
    const initials = getInitials(title)
    const bgColor = generateColor(title)
    
    return (
      <div 
        className={`${className} ${bgColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}
        style={fill ? { position: 'absolute', inset: 0 } : undefined}
      >
        <span className="drop-shadow-sm">{initials}</span>
      </div>
    )
  }

  // Si hay un fallback disponible, usarlo
  const imageSrc = fallbackSrc || src

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={handleImageError}
      onLoad={() => setIsLoading(false)}
      onLoadingComplete={() => setIsLoading(false)}
    />
  )
}