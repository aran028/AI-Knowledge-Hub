import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getYouTubeContentDefaults } from '../../../../lib/data';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "youtube-webhook",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK START ===');
    
    // Verificar webhook secret - probar ambas variables
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecret = process.env.WEBHOOK_SECRET || process.env.N8N_WEBHOOK_SECRET;
    
    console.log('Received secret:', webhookSecret);
    console.log('Expected secret exists:', !!expectedSecret);
    console.log('WEBHOOK_SECRET exists:', !!process.env.WEBHOOK_SECRET);
    console.log('N8N_WEBHOOK_SECRET exists:', !!process.env.N8N_WEBHOOK_SECRET);
    
    if (webhookSecret !== expectedSecret) {
      console.log('Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized webhook' }, 
        { status: 401 }
      );
    }

    const payload = await request.json();
    console.log('Received payload:', JSON.stringify(payload, null, 2));

    // Validar datos requeridos básicos
    if (!payload.video_id || !payload.title) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: video_id, title' }, 
        { status: 400 }
      );
    }

    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // === AUTO-CLASIFICACIÓN: asignar playlist_id automáticamente ===
    let assignedPlaylistId: string | null = payload.playlist_id || null;

    if (!assignedPlaylistId) {
      // 1. Obtener todas las playlists
      const { data: playlists } = await supabase
        .from('playlists')
        .select('id, name');

      if (playlists && playlists.length > 0) {
        // 2. Obtener todos los tags de tools agrupados por playlist
        const { data: tools } = await supabase
          .from('tools')
          .select('playlist_id, tags, title');

        // 3. Construir mapa: playlist_id → [keywords]
        const keywordMap: Record<string, string[]> = {};
        for (const playlist of playlists) {
          // Palabras del nombre de la playlist
          const nameWords = playlist.name.toLowerCase().split(/\s+/);
          keywordMap[playlist.id] = [...nameWords];
        }
        // Añadir tags y títulos de tools
        for (const tool of (tools || [])) {
          if (tool.playlist_id && keywordMap[tool.playlist_id]) {
            const toolKeywords = [
              ...(tool.tags || []).map((t: string) => t.toLowerCase()),
              ...tool.title.toLowerCase().split(/\s+/)
            ];
            keywordMap[tool.playlist_id].push(...toolKeywords);
          }
        }

        // 4. Puntuar cada playlist contra el video
        const videoText = [
          payload.title || '',
          payload.description || '',
          payload.channel_name || ''
        ].join(' ').toLowerCase();

        let bestScore = 0;
        let bestPlaylistId: string | null = null;

        for (const [playlistId, keywords] of Object.entries(keywordMap)) {
          const uniqueKeywords = [...new Set(keywords)].filter(k => k.length > 2);
          let score = 0;
          for (const keyword of uniqueKeywords) {
            if (videoText.includes(keyword)) score++;
          }
          if (score > bestScore) {
            bestScore = score;
            bestPlaylistId = playlistId;
          }
        }

        if (bestScore > 0) {
          assignedPlaylistId = bestPlaylistId;
          console.log(`Auto-clasificado en playlist ${bestPlaylistId} con score ${bestScore}`);
        } else {
          console.log('Sin playlist coincidente, guardando sin clasificar');
        }
      }
    }

    // Usar valores por defecto para campos requeridos
    const videoData = getYouTubeContentDefaults({
      ...payload,
      playlist_id: assignedPlaylistId
    });
    
    console.log('=== SAVING TO DATABASE (WITH DEFAULTS) ===');
    console.log('Video data with defaults:', videoData);
    console.log('Assigned playlist_id:', assignedPlaylistId);

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('youtube_content')
      .insert([videoData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Data attempted to insert:', JSON.stringify(videoData, null, 2));
      return NextResponse.json(
        { 
          error: 'Database insertion failed',
          details: error.message,
          code: error.code,
          hint: error.hint,
          data_attempted: videoData
        }, 
        { status: 500 }
      );
    }

    console.log('=== SUCCESS - DATA SAVED ===');
    console.log('Saved data:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Video data saved to database successfully',
      data: {
        saved_record: data[0],
        assigned_playlist_id: assignedPlaylistId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}