import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verificar tabla youtube_content
    const { count: youtubeCount } = await supabase
      .from('youtube_content')
      .select('*', { count: 'exact', head: true })

    // Intentar verificar si existe tabla playlists
    let playlistsExists = false
    let playlistsCount = 0
    try {
      const { count } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true })
      playlistsExists = true
      playlistsCount = count || 0
    } catch (err) {
      console.log('Playlists table does not exist')
    }

    // Intentar verificar si existe tabla tools  
    let toolsExists = false
    let toolsCount = 0
    try {
      const { count } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
      toolsExists = true
      toolsCount = count || 0
    } catch (err) {
      console.log('Tools table does not exist')
    }

    return NextResponse.json({
      success: true,
      tables: {
        youtube_content: {
          exists: true,
          count: youtubeCount
        },
        playlists: {
          exists: playlistsExists,
          count: playlistsCount
        },
        tools: {
          exists: toolsExists,
          count: toolsCount
        }
      }
    })

  } catch (error) {
    console.error('Database tables check error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check database tables',
      details: error.message 
    }, { status: 500 })
  }
}