import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DATABASE TEST START ===')
    
    // Verificar webhook secret
    const webhookSecret = request.headers.get('x-webhook-secret')
    const expectedSecret = process.env.N8N_WEBHOOK_SECRET
    
    if (webhookSecret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await request.json()
    console.log('Payload received:', JSON.stringify(payload, null, 2))

    // Inicializar cliente Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Test 1: Simple insert (solo campos básicos)
    const simpleData = {
      video_id: payload.video_id || 'debug_test',
      title: payload.title || 'Debug Test Title'
    }

    console.log('Testing simple insert:', simpleData)

    const { data: simpleResult, error: simpleError } = await supabase
      .from('youtube_content')
      .insert([simpleData])
      .select()

    if (simpleError) {
      console.error('Simple insert failed:', simpleError)
      return NextResponse.json({
        test: 'simple_insert',
        success: false,
        error: simpleError.message,
        error_details: simpleError,
        attempted_data: simpleData
      })
    }

    console.log('Simple insert SUCCESS:', simpleResult)

    // Test 2: Complex insert (todos los campos)
    const complexData = {
      video_id: `${payload.video_id}_complex` || 'debug_complex',
      title: payload.title || 'Debug Complex Title',
      description: payload.description || '',
      channel_name: payload.channel_name || 'Test Channel',
      channel_url: payload.channel_url || null,
      video_url: `https://www.youtube.com/watch?v=${payload.video_id}` || null,
      thumbnail_url: payload.thumbnail_url || null,
      duration: payload.duration || null,
      published_at: payload.published_at || new Date().toISOString(),
      view_count: payload.view_count ? parseInt(payload.view_count) : 0,
      like_count: payload.like_count ? parseInt(payload.like_count) : 0,
      ai_classification: payload.ai_classification?.category || null,
      confidence_score: payload.ai_classification?.confidence || null,
      related_tools: payload.ai_classification?.tools_detected || [],
      ai_summary: payload.ai_classification?.reasoning || null,
      ai_key_points: payload.ai_key_points || [],
      tags: payload.tags || [],
      playlist_id: payload.playlist_id || null,
      user_id: payload.user_id || null
    }

    console.log('Testing complex insert:', complexData)

    const { data: complexResult, error: complexError } = await supabase
      .from('youtube_content')
      .insert([complexData])
      .select()

    if (complexError) {
      console.error('Complex insert failed:', complexError)
      return NextResponse.json({
        test: 'complex_insert',
        success: false,
        error: complexError.message,
        error_details: complexError,
        attempted_data: complexData,
        simple_insert_worked: true
      })
    }

    return NextResponse.json({
      test: 'both_inserts',
      success: true,
      simple_result: simpleResult[0],
      complex_result: complexResult[0],
      message: 'Both simple and complex inserts worked!'
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      test: 'general_error',
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}