import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "n8n-error-capture",
    timestamp: new Date().toISOString(),
    version: "3.0.0"
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== N8N ERROR CAPTURE WEBHOOK START ===');
    
    // CAPTURAR TODO - Headers, IP, User Agent, etc.
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    console.log('📋 ALL HEADERS:', JSON.stringify(headers, null, 2));
    
    // Verificar webhook secret (múltiples opciones)
    const webhookSecret = request.headers.get('x-webhook-secret');
    const validSecrets = [
      'webhook_secret_n8n_production_ai_hub_xyz789',
      process.env.WEBHOOK_SECRET,
      process.env.N8N_WEBHOOK_SECRET
    ].filter(Boolean);
    
    console.log('🔑 Secret received:', webhookSecret ? `${webhookSecret.slice(0, 15)}...` : 'none');
    console.log('🔑 Valid secrets count:', validSecrets.length);
    
    if (!validSecrets.includes(webhookSecret)) {
      console.log('❌ Unauthorized webhook attempt');
      const errorResponse = {
        success: false,
        error: 'Unauthorized webhook',
        debug: {
          received_secret: webhookSecret ? `${webhookSecret.slice(0, 10)}...` : 'none',
          expected_secrets: validSecrets.length,
          headers: headers,
          timestamp: new Date().toISOString()
        }
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    console.log('✅ Authentication successful');

    const payload = await request.json();
    console.log('📥 RECEIVED PAYLOAD:', JSON.stringify(payload, null, 2));

    // Validar datos requeridos básicos
    if (!payload.video_id || !payload.title) {
      console.log('❌ Missing required fields');
      const errorResponse = {
        success: false,
        error: 'Missing required fields: video_id, title',
        debug: {
          received_fields: Object.keys(payload),
          payload: payload
        }
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Verificar variables de entorno de Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('🔧 Environment check:');
    console.log('- SUPABASE_URL exists:', !!supabaseUrl);
    console.log('- SERVICE_KEY exists:', !!supabaseServiceKey);

    if (!supabaseUrl || !supabaseServiceKey) {
      const errorResponse = {
        success: false,
        error: 'Missing Supabase environment variables',
        debug: {
          supabase_url_exists: !!supabaseUrl,
          service_key_exists: !!supabaseServiceKey,
          payload: payload
        }
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // Inicializar cliente Supabase
    console.log('🔗 Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Preparar datos con MÁXIMOS detalles de debug
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
    
    console.log('💾 ATTEMPTING DATABASE SAVE...');
    console.log('📊 Video data prepared:', JSON.stringify(videoData, null, 2));
    console.log('📊 Original payload:', JSON.stringify(payload, null, 2));

    // UPSERT: Actualizar si existe, insertar si es nuevo
    const { data, error } = await supabase
      .from('youtube_content')
      .upsert([videoData], { 
        onConflict: 'video_id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('❌ SUPABASE ERROR:', error);
      console.error('❌ ERROR DETAILS:', JSON.stringify(error, null, 2));
      console.error('❌ DATA ATTEMPTED:', JSON.stringify(videoData, null, 2));
      
      const errorResponse = {
        success: false,
        error: 'Database insertion failed',
        supabase_error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        },
        debug: {
          attempted_data: videoData,
          original_payload: payload,
          timestamp: new Date().toISOString(),
          headers: headers,
          environment: {
            supabase_url_exists: !!supabaseUrl,
            service_key_exists: !!supabaseServiceKey
          }
        }
      };
      
      return NextResponse.json(errorResponse, { status: 500 });
    }

    console.log('✅ SUCCESS - DATA SAVED');
    console.log('💾 Saved data:', data);

    const successResponse = {
      success: true, 
      message: 'Video content saved successfully to database',
      data: {
        saved_record: data[0],
        received_fields: Object.keys(payload),
        timestamp: new Date().toISOString()
      }
    };
    
    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('❌ WEBHOOK ERROR:', error);
    
    const errorResponse = {
      success: false,
      error: 'Internal server error', 
      details: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}