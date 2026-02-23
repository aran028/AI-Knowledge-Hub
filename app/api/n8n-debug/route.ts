import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "n8n-debug",
    timestamp: new Date().toISOString(),
    message: "Debugging endpoint for n8n webhook issues"
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== N8N DEBUG WEBHOOK START ===');
    
    // Capturar TODOS los headers
    const allHeaders = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    
    console.log('📋 ALL HEADERS:', JSON.stringify(allHeaders, null, 2));
    
    const webhookSecret = request.headers.get('x-webhook-secret');
    console.log('🔑 Webhook Secret received:', webhookSecret);
    
    // Intentar leer el body
    let payload;
    try {
      payload = await request.json();
      console.log('📥 Payload received:', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.log('❌ Error parsing JSON:', e.message);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body',
        debug: {
          headers: allHeaders,
          error_details: e.message
        }
      }, { status: 400 });
    }

    // Debug completo
    const debugInfo = {
      success: true,
      message: 'Debug information captured',
      debug: {
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url,
        headers: allHeaders,
        webhook_secret: webhookSecret,
        payload: payload,
        content_type: request.headers.get('content-type'),
        user_agent: request.headers.get('user-agent'),
        expected_secret: 'webhook_secret_n8n_production_ai_hub_xyz789',
        secret_matches: webhookSecret === 'webhook_secret_n8n_production_ai_hub_xyz789'
      }
    };

    console.log('🐛 DEBUG INFO:', JSON.stringify(debugInfo, null, 2));

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('❌ Debug webhook error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug webhook error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}