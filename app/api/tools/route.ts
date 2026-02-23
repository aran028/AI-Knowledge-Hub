import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlist');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from('tools')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filtro de playlist
    if (playlistId && playlistId !== 'all') {
      query = query.eq('playlist_id', playlistId);
    }

    // Filtro de búsqueda
    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase tools error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch tools',
        details: error.message 
      }, { status: 500 });
    }

    // Mapear playlist_id a category para compatibilidad
    const categoryMap = {
      '3859ca3b-4476-4275-8f50-245a304de09d': 'Development Tools',
      'c4f7b623-9016-4084-a9f2-b12427c48699': 'Architecture',
      '722e9e19-4a0c-4a79-9f2e-5f498030b235': 'Cloud Platforms',
      '8060f02c-928f-4e14-889d-37099e057769': 'DevOps & CI/CD',
      'de747fec-502d-47e0-b7ff-3acccb46e127': 'Testing & QA'
    };

    // Agregar category a cada tool
    const toolsWithCategory = data.map(tool => ({
      ...tool,
      category: categoryMap[tool.playlist_id] || 'General'
    }));

    // Organizar en categorías para el formato esperado
    const totalTools = toolsWithCategory.length;
    console.log(`Total tools found: ${totalTools}${playlistId ? ` for playlist ${playlistId}` : ''}`);
    
    let recentlyAdded, popularTools;
    
    if (playlistId) {
      // Para playlist específica, mostrar todas las herramientas en "popular" 
      // (que es lo que se muestra en las páginas de playlist)
      recentlyAdded = totalTools > 4 ? toolsWithCategory.slice(0, 4) : toolsWithCategory;
      popularTools = toolsWithCategory; // Todas las herramientas para playlist específica
    } else {
      // Para página principal, dividir entre recent y popular
      if (totalTools >= 20) {
        recentlyAdded = toolsWithCategory.slice(0, 10); // Primeros 10
        popularTools = toolsWithCategory.slice(10, 20); // Siguientes 10
      } else if (totalTools >= 10) {
        recentlyAdded = toolsWithCategory.slice(0, 10); // Primeros 10
        popularTools = []; // Vacío si no hay suficientes
      } else {
        recentlyAdded = toolsWithCategory; // Todas las herramientas
        popularTools = []; // Vacío
      }
    }

    console.log(`Recent: ${recentlyAdded.length}, Popular: ${popularTools.length}`);

    return NextResponse.json({
      success: true,
      data: {
        recent: recentlyAdded,
        popular: popularTools,
        all: toolsWithCategory
      },
      total: count || toolsWithCategory.length
    });

  } catch (error) {
    console.error('Tools API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}