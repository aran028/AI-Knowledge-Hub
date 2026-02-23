import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "supabase-test",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== SUPABASE CONNECTION TEST ===');
    
    const payload = await request.json();
    console.log('Received test payload:', payload);

    // Verificar variables de entorno
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Environment check:');
    console.log('- SUPABASE_URL exists:', !!supabaseUrl);
    console.log('- SUPABASE_URL value:', supabaseUrl ? `${supabaseUrl.slice(0, 20)}...` : 'MISSING');
    console.log('- SERVICE_KEY exists:', !!supabaseServiceKey);
    console.log('- SERVICE_KEY value:', supabaseServiceKey ? `${supabaseServiceKey.slice(0, 20)}...` : 'MISSING');

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        details: {
          supabase_url_exists: !!supabaseUrl,
          service_key_exists: !!supabaseServiceKey
        }
      }, { status: 500 });
    }

    // Crear cliente Supabase
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Test 1: Verificar conexión básica
    console.log('Test 1: Basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('youtube_content')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return NextResponse.json({
        success: false,
        test: 'connection_test',
        error: 'Supabase connection failed',
        details: connectionError
      }, { status: 500 });
    }

    // Test 2: Verificar estructura de tabla
    console.log('Test 2: Table structure...');
    const testData = {
      video_id: 'test_structure',
      title: 'Test Structure',
      channel_name: 'Test Channel'
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('youtube_content')
      .insert([testData])
      .select();

    if (insertError) {
      console.error('Insert test failed:', insertError);
      return NextResponse.json({
        success: false,
        test: 'insert_test',
        error: 'Insert failed',
        details: {
          error_message: insertError.message,
          error_code: insertError.code,
          error_details: insertError.details,
          error_hint: insertError.hint,
          attempted_data: testData
        }
      }, { status: 500 });
    }

    console.log('✅ All tests passed!');
    return NextResponse.json({
      success: true,
      message: 'Supabase connection and insertion working correctly',
      tests_passed: [
        'environment_variables',
        'supabase_connection', 
        'table_insertion'
      ],
      inserted_record: insertTest[0]
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test endpoint error',
      details: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : 'Unknown error'
    }, { status: 500 });
  }
}