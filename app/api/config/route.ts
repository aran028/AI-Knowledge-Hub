import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Devolver configuración para testing
    const config = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      environment: process.env.NODE_ENV || 'development'
    }

    return NextResponse.json({
      success: true,
      ...config
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error loading configuration',
      url: '',
      key: ''
    }, { status: 500 })
  }
}