import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "n8n-production-webhook",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== N8N PRODUCTION WEBHOOK START ===');
    
    // Verificar webhook secret (múltiples opciones)
    const webhookSecret = request.headers.get('x-webhook-secret');
    const validSecrets = [
      'webhook_secret_n8n_production_ai_hub_xyz789',
      process.env.WEBHOOK_SECRET,
      process.env.N8N_WEBHOOK_SECRET
    ].filter(Boolean);
    
    console.log('Received secret:', webhookSecret ? `${webhookSecret.slice(0, 15)}...` : 'none');
    console.log('Valid secrets count:', validSecrets.length);
    
    if (!validSecrets.includes(webhookSecret)) {
      console.log('❌ Unauthorized webhook attempt');
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized webhook',
          debug: {
            receivedSecret: webhookSecret ? `${webhookSecret.slice(0, 10)}...` : 'none',
            expectedSecrets: validSecrets.length
          }
        }, 
        { status: 401 }
      );
    }

    console.log('✅ Authentication successful');

    const payload = await request.json();
    console.log('📥 Received payload:', JSON.stringify(payload, null, 2));

    // Validar datos requeridos básicos
    if (!payload.video_id || !payload.title) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: video_id, title' 
        }, 
        { status: 400 }
      );
    }

    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Datos completos con valores por defecto para campos NOT NULL
    const videoData = {
      video_id: payload.video_id,
      title: payload.title,
      channel_name: payload.channel_name || 'Canal desconocido', // NOT NULL
      video_url: payload.video_url || `https://www.youtube.com/watch?v=${payload.video_id}`, // NOT NULL
      description: payload.description || null,
      channel_url: payload.channel_url || null,
      thumbnail_url: payload.thumbnail_url || null,
      duration: payload.duration || null,
      published_at: payload.published_at || null,
      view_count: payload.view_count || 0,
      like_count: payload.like_count || 0,
      ai_classification: payload.ai_classification || {},
      confidence_score: payload.confidence_score || null,
      related_tools: payload.related_tools || [],
      tags: payload.tags || [],
      ai_key_points: payload.ai_key_points || [],
      ai_summary: payload.ai_summary || null,
      playlist_id: payload.playlist_id || null,
      user_id: payload.user_id || null
    };
    
    console.log('💾 Saving to database...');
    console.log('Video data:', JSON.stringify(videoData, null, 2));

    // UPSERT: Actualizar si existe, insertar si es nuevo
    const { data, error } = await supabase
      .from('youtube_content')
      .upsert([videoData], { 
        onConflict: 'video_id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Database insertion failed',
          details: error.message,
          error_code: error.code,
          data_attempted: videoData,
          timestamp: new Date().toISOString()
        }, 
        { status: 500 }
      );
    }

    console.log('✅ SUCCESS - DATA SAVED');
    console.log('Saved data:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'Video content saved successfully to database',
      data: {
        saved_record: data[0],
        received_fields: Object.keys(payload),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}