import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "youtube-webhook-final",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== FINAL WEBHOOK START ===');
    
    // Verificar webhook secret (múltiples opciones para debugging)
    const webhookSecret = request.headers.get('x-webhook-secret');
    const expectedSecrets = [
      process.env.WEBHOOK_SECRET,
      process.env.N8N_WEBHOOK_SECRET,
      'webhook_secret_n8n_production_ai_hub_xyz789'
    ].filter(Boolean);
    
    console.log('Received secret:', webhookSecret);
    console.log('Available secrets:', expectedSecrets.length);
    console.log('Secret match:', expectedSecrets.includes(webhookSecret));
    
    if (!expectedSecrets.includes(webhookSecret)) {
      console.log('Unauthorized webhook attempt');
      return NextResponse.json(
        { 
          error: 'Unauthorized webhook',
          debug: {
            receivedSecret: webhookSecret ? `${webhookSecret.slice(0, 10)}...` : 'none',
            availableSecrets: expectedSecrets.length
          }
        }, 
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

    // Usar valores por defecto para campos requeridos NON-NULL
    const videoData = {
      video_id: payload.video_id,
      title: payload.title,
      channel_name: payload.channel_name || 'Canal desconocido',
      description: payload.description || null,
      channel_url: payload.channel_url || null,
      video_url: payload.video_url || null,
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
    
    console.log('=== SAVING TO DATABASE (FINAL VERSION) ===');
    console.log('Video data with defaults:', videoData);

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
          test: 'final_webhook',
          success: false,
          error: error.message,
          error_details: error,
          data_attempted: videoData,
          timestamp: new Date().toISOString()
        }, 
        { status: 500 }
      );
    }

    console.log('=== SUCCESS - DATA SAVED ===');
    console.log('Saved data:', data);

    return NextResponse.json({ 
      test: 'final_webhook',
      success: true, 
      message: 'Video data saved to database successfully',
      data: {
        saved_record: data[0],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        test: 'final_webhook',
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}