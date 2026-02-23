import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// POST /api/youtube/reclassify
// Re-clasifica todos los videos sin playlist_id comparando su texto contra las playlists/tools
export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Obtener playlists y tools
    const [{ data: playlists }, { data: tools }] = await Promise.all([
      supabase.from('playlists').select('id, name'),
      supabase.from('tools').select('playlist_id, tags, title'),
    ]);

    if (!playlists || playlists.length === 0) {
      return NextResponse.json({ success: false, error: 'No playlists found' }, { status: 400 });
    }

    // 2. Construir mapa de keywords por playlist
    const keywordMap: Record<string, string[]> = {};
    for (const playlist of playlists) {
      keywordMap[playlist.id] = playlist.name.toLowerCase().split(/\s+/);
    }
    for (const tool of (tools || [])) {
      if (tool.playlist_id && keywordMap[tool.playlist_id]) {
        keywordMap[tool.playlist_id].push(
          ...(tool.tags || []).map((t: string) => t.toLowerCase()),
          ...tool.title.toLowerCase().split(/\s+/)
        );
      }
    }

    // 3. Obtener todos los videos (o solo los sin playlist)
    const { data: videos, error: videosError } = await supabase
      .from('youtube_content')
      .select('id, title, description, channel_name')
      .is('playlist_id', null);

    if (videosError) {
      return NextResponse.json({ success: false, error: videosError.message }, { status: 500 });
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json({ success: true, message: 'No unclassified videos found', updated: 0 });
    }

    // 4. Clasificar cada video y actualizar
    let updated = 0;
    const results: Array<{ id: string; title: string; playlist_id: string | null; score: number }> = [];

    for (const video of videos) {
      const videoText = [
        video.title || '',
        video.description || '',
        video.channel_name || ''
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

      if (bestPlaylistId && bestScore > 0) {
        const { error: updateError } = await supabase
          .from('youtube_content')
          .update({ playlist_id: bestPlaylistId })
          .eq('id', video.id);

        if (!updateError) {
          updated++;
          results.push({ id: video.id, title: video.title, playlist_id: bestPlaylistId, score: bestScore });
        }
      } else {
        results.push({ id: video.id, title: video.title, playlist_id: null, score: 0 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updated} videos reclassified out of ${videos.length}`,
      updated,
      total: videos.length,
      results
    });

  } catch (error) {
    console.error('Reclassify error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
