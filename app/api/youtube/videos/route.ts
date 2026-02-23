import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const playlist = searchParams.get('playlist');
    const minConfidence = searchParams.get('minConfidence');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('youtube_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filtro de búsqueda
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,channel_name.ilike.%${search}%`);
    }

    // Filtro de playlist
    if (playlist && playlist !== 'all') {
      query = query.eq('playlist_id', playlist);
    }

    // Filtro de confianza
    if (minConfidence) {
      query = query.gte('confidence_score', parseFloat(minConfidence));
    }

    const { data: videos, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // Transformar datos para el frontend
    const transformedVideos = (videos || []).map(video => ({
      id: video.id,
      video_id: video.video_id,
      title: video.title,
      description: video.description,
      channel_name: video.channel_name,
      channel_url: video.channel_url,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      duration: video.duration,
      published_at: video.published_at,
      view_count: video.view_count,
      like_count: video.like_count,
      ai_classification: video.ai_classification,
      confidence_score: video.confidence_score,
      related_tools: video.related_tools,
      tags: video.tags,
      ai_key_points: video.ai_key_points,
      ai_summary: video.ai_summary,
      playlist_id: video.playlist_id,
      created_at: video.created_at,
      updated_at: video.updated_at
    }));

    return NextResponse.json({
      success: true,
      data: transformedVideos,
      total: videos?.length || 0
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}