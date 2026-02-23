import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Contar videos totales
    const { count: totalCount } = await supabase
      .from('youtube_content')
      .select('*', { count: 'exact', head: true });

    // Obtener últimos 5 videos
    const { data: recentVideos, error } = await supabase
      .from('youtube_content')
      .select('video_id, title, channel_name, ai_classification, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // Calcular tamaño aproximado
    const avgSizePerVideo = 3; // KB aproximado
    const totalSizeKB = (totalCount || 0) * avgSizePerVideo;
    const totalSizeMB = totalSizeKB / 1024;

    return NextResponse.json({
      success: true,
      statistics: {
        total_videos: totalCount || 0,
        estimated_size_kb: totalSizeKB,
        estimated_size_mb: Math.round(totalSizeMB * 100) / 100,
        storage_type: 'metadata_only'
      },
      recent_videos: recentVideos || [],
      info: {
        note: 'Solo se almacenan metadatos, no archivos de video',
        avg_size_per_record: '2-5 KB',
        last_updated: new Date().toISOString()
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error checking videos',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}