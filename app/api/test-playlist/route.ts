import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Test specific playlist
    const testPlaylistId = 'c4f7b623-9016-4084-a9f2-b12427c48699';
    
    const { data: toolsData, error } = await supabase
      .from('tools')
      .select('id, title')
      .eq('playlist_id', testPlaylistId);
      
    return NextResponse.json({
      success: true,
      playlist_id: testPlaylistId,
      found_tools: toolsData?.length || 0,
      tools: toolsData,
      error: error?.message || null
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}