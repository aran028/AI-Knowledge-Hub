import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK DEBUG START ===')
    
    // 1. Verificar headers
    const webhookSecret = request.headers.get('x-webhook-secret')
    const contentType = request.headers.get('content-type')
    console.log('Headers:', { webhookSecret, contentType })
    
    // 2. Verificar environment variables
    const envCheck = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      WEBHOOK_SECRET: !!process.env.N8N_WEBHOOK_SECRET,
      WEBHOOK_SECRET_VALUE: process.env.N8N_WEBHOOK_SECRET
    }
    console.log('Environment:', envCheck)
    
    // 3. Verificar payload
    const payload = await request.json()
    console.log('Payload:', payload)
    
    // 4. Basic validation
    const validation = {
      has_video_id: !!payload.video_id,
      has_title: !!payload.title,
      has_ai_classification: !!payload.ai_classification
    }
    console.log('Validation:', validation)
    
    console.log('=== WEBHOOK DEBUG END ===')
    
    return NextResponse.json({
      status: 'debug_success',
      headers: { webhookSecret, contentType },
      environment: envCheck,
      payload: payload,
      validation: validation,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('DEBUG ERROR:', error)
    return NextResponse.json({
      status: 'debug_error',
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}