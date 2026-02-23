import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "youtube-webhook-debug",
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG WEBHOOK START ===')
    
    // Verificar webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET
    
    console.log('Received secret:', webhookSecret)
    console.log('Expected secret exists:', !!expectedSecret)
    
    if (webhookSecret !== expectedSecret) {
      console.log('Unauthorized webhook attempt')
      return NextResponse.json(
        { error: 'Unauthorized webhook' }, 
        { status: 401 }
      )
    }

    const payload = await request.json()
    console.log('=== PAYLOAD FROM N8N ===')
    console.log('Full payload:', JSON.stringify(payload, null, 2))
    console.log('Payload keys:', Object.keys(payload))
    
    // Verificar campos requeridos
    if (!payload.video_id || !payload.title) {
      console.log('Missing required fields')
      return NextResponse.json({
        error: 'Missing required fields',
        received_fields: Object.keys(payload),
        payload: payload
      }, { status: 400 })
    }

    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // PASO 1: Probar inserción ULTRA MINIMA
    const minimalData = {
      video_id: payload.video_id,
      title: payload.title
    }

    console.log('=== TRYING MINIMAL INSERT ===')
    console.log('Minimal data:', minimalData)

    const { data: minimalResult, error: minimalError } = await supabase
      .from('youtube_content')
      .insert([minimalData])
      .select()

    if (minimalError) {
      console.error('MINIMAL INSERT FAILED:', minimalError)
      return NextResponse.json({
        step: 'minimal_insert_failed',
        error: minimalError.message,
        error_code: minimalError.code,
        error_details: minimalError,
        attempted_data: minimalData,
        payload_received: payload
      }, { status: 500 })
    }

    console.log('MINIMAL INSERT SUCCESS:', minimalResult)

    // PASO 2: Si minimal funciona, probar con más campos uno por uno
    const extendedData = {
      video_id: `${payload.video_id}_extended`,
      title: payload.title,
      description: payload.description || ''
    }

    console.log('=== TRYING EXTENDED INSERT ===')
    console.log('Extended data:', extendedData)

    const { data: extendedResult, error: extendedError } = await supabase
      .from('youtube_content')
      .insert([extendedData])
      .select()

    if (extendedError) {
      console.error('EXTENDED INSERT FAILED:', extendedError)
      return NextResponse.json({
        step: 'extended_insert_failed',
        minimal_worked: true,
        minimal_result: minimalResult[0],
        error: extendedError.message,
        error_code: extendedError.code,
        error_details: extendedError,
        attempted_data: extendedData,
        payload_received: payload
      }, { status: 500 })
    }

    console.log('=== SUCCESS ===')
    return NextResponse.json({
      success: true,
      minimal_result: minimalResult[0],
      extended_result: extendedResult[0],
      payload_received: payload,
      message: 'Both minimal and extended inserts worked!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug webhook error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}