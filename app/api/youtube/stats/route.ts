import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Contar videos totales
    const { count: totalVideos } = await supabase
      .from('youtube_content')
      .select('*', { count: 'exact', head: true });

    // Obtener estadísticas por categoría
    const { data: categoryStats } = await supabase
      .from('youtube_content')
      .select('ai_classification')
      .not('ai_classification', 'is', null);

    // Procesar categorías
    const categoryCount: { [key: string]: number } = {};
    categoryStats?.forEach((item) => {
      const category = item.ai_classification?.category;
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });

    // Obtener videos recientes (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentVideosCount } = await supabase
      .from('youtube_content')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Calcular confianza promedio
    const { data: confidenceData } = await supabase
      .from('youtube_content')
      .select('confidence_score')
      .not('confidence_score', 'is', null);

    const confidenceScores = confidenceData?.map(item => item.confidence_score).filter(score => score !== null) || [];
    const averageConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        total_videos: totalVideos || 0,
        recent_videos: recentVideosCount || 0,
        categories: categoryCount,
        average_confidence: Math.round(averageConfidence * 100) / 100,
        confidence_distribution: {
          high: confidenceScores.filter(score => score >= 0.8).length,
          medium: confidenceScores.filter(score => score >= 0.6 && score < 0.8).length,
          low: confidenceScores.filter(score => score < 0.6).length
        }
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}