import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase con service role para bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tipos para la respuesta del webhook de n8n
interface YouTubeWebhookPayload {
  video_id: string
  title: string
  description?: string
  channel_name: string
  channel_url?: string
  video_url: string
  thumbnail_url?: string
  duration?: string
  published_at?: string
  view_count?: number
  like_count?: number
  
  // Clasificación por IA
  ai_classification: {
    category: string
    subcategory?: string
    tools_detected: string[]
    confidence: number
    reasoning: string
  }
  ai_summary?: string
  ai_key_points?: string[]
  
  // Usuario destino (puede venir del contexto de n8n)
  user_email?: string
  user_id?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que la petición viene de n8n (opcional: verificar webhook secret)
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized webhook' }, 
        { status: 401 }
      )
    }

    const payload: YouTubeWebhookPayload = await request.json()

    // Validar datos requeridos
    if (!payload.video_id || !payload.title || !payload.ai_classification) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    let userId = payload.user_id

    // Si no se proporciona user_id, intentar obtenerlo por email
    if (!userId && payload.user_email) {
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      const userData = users?.users?.find(user => user.email === payload.user_email)
      if (userData) {
        userId = userData.id
      } else {
        console.warn(`User not found for email: ${payload.user_email}`)
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        )
      }
    }

    // Determinar playlist_id basado en la clasificación de IA
    let playlistId = null
    if (payload.ai_classification.category && userId) {
      const { data: playlistData } = await supabaseAdmin
        .from('playlists')
        .select('id')
        .eq('name', payload.ai_classification.category)
        .eq('user_id', userId)
        .single()

      if (playlistData) {
        playlistId = playlistData.id
      }
    }

    // Preparar datos para inserción
    const youtubeData = {
      video_id: payload.video_id,
      title: payload.title,
      description: payload.description || null,
      channel_name: payload.channel_name,
      channel_url: payload.channel_url || null,
      video_url: payload.video_url,
      thumbnail_url: payload.thumbnail_url || `https://img.youtube.com/vi/${payload.video_id}/mqdefault.jpg`,
      duration: payload.duration || null,
      published_at: payload.published_at ? new Date(payload.published_at).toISOString() : null,
      view_count: payload.view_count || null,
      like_count: payload.like_count || null,
      
      ai_classification: payload.ai_classification,
      confidence_score: payload.ai_classification.confidence,
      related_tools: payload.ai_classification.tools_detected || [],
      playlist_id: playlistId,
      
      tags: extractTags(payload),
      ai_summary: payload.ai_summary || null,
      ai_key_points: payload.ai_key_points || [],
      
      user_id: userId,
    }

    // Insertar en la base de datos (con upsert para evitar duplicados)
    const { data, error } = await supabaseAdmin
      .from('youtube_content')
      .upsert(youtubeData, { 
        onConflict: 'video_id,user_id',
        ignoreDuplicates: false 
      })
      .select()

    if (error) {
      console.error('Error inserting YouTube content:', error)
      return NextResponse.json(
        { error: 'Database error', details: error.message }, 
        { status: 500 }
      )
    }

    // Log para monitoreo
    console.log(`YouTube content processed: ${payload.title} for user ${userId}`)

    return NextResponse.json({
      success: true,
      message: 'YouTube content processed successfully',
      data: data?.[0],
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

// Función auxiliar para extraer tags relevantes
function extractTags(payload: YouTubeWebhookPayload): string[] {
  const tags: string[] = []
  
  // Tags basados en la clasificación de IA
  if (payload.ai_classification.category) {
    tags.push(payload.ai_classification.category)
  }
  
  if (payload.ai_classification.subcategory) {
    tags.push(payload.ai_classification.subcategory)
  }

  // Tags basados en herramientas detectadas
  tags.push(...payload.ai_classification.tools_detected)

  // Tags basados en el canal
  tags.push(`channel:${payload.channel_name.toLowerCase().replace(/\s+/g, '-')}`)

  // Tags basados en confianza
  if (payload.ai_classification.confidence > 0.8) {
    tags.push('high-confidence')
  } else if (payload.ai_classification.confidence > 0.6) {
    tags.push('medium-confidence')
  } else {
    tags.push('low-confidence')
  }

  return [...new Set(tags)] // Eliminar duplicados
}

// Endpoint GET pour tester la connectivité
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: 'youtube-webhook',
    timestamp: new Date().toISOString(),
  })
}