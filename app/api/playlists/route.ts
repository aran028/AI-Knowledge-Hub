import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get all playlists and count tools separately (reliable approach)
    const { data: playlistsData, error } = await supabase
      .from('playlists')
      .select('id, name, description, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch playlists',
        details: error.message 
      }, { status: 500 });
    }

    // Get tool counts for each playlist individually (most reliable)
    const playlistsWithCount = await Promise.all(
      (playlistsData || []).map(async (playlist) => {
        const { data: toolsData, error: toolsError } = await supabase
          .from('tools')
          .select('id')
          .eq('playlist_id', playlist.id);
        
        const count = toolsData ? toolsData.length : 0;
        console.log(`Playlist ${playlist.name}: ${count} tools${toolsError ? `, error: ${toolsError.message}` : ''}`);
        
        return {
          ...playlist,
          count
        };
      })
    );
    
    const finalPlaylists = playlistsWithCount;

    // Transformar datos para incluir iconos apropiados
    const iconOptions = ['brain', 'code', 'workflow', 'terminal', 'palette', 'notebook', 'git-branch', 'server', 'layers'];
    
    const playlists = finalPlaylists.map((playlist, index) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      icon: iconOptions[index % iconOptions.length], // Asignar ícono basado en posición
      count: playlist.count,
      created_at: playlist.created_at
    }));

    return NextResponse.json({
      success: true,
      data: playlists,
      total: finalPlaylists.length
    });

  } catch (error) {
    console.error('Playlists API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}