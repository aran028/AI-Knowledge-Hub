import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  if (error) {
    console.error('Auth callback error:', error, error_description)
    // Redirigir con error
    return NextResponse.redirect(
      `${origin}/auth/reset-password?error=${encodeURIComponent(error)}&error_code=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || 'Unknown error')}`
    )
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(
          `${origin}/auth/reset-password?error=${encodeURIComponent(error.message)}&error_code=exchange_failed`
        )
      }

      // Check if this is a password reset flow
      if (next === '/auth/reset-password' || searchParams.get('type') === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }

      // For email confirmation, redirect to home
      return NextResponse.redirect(`${origin}${next}`)

    } catch (error: any) {
      console.error('Exception during auth callback:', error)
      return NextResponse.redirect(
        `${origin}/auth/reset-password?error=${encodeURIComponent(error.message)}&error_code=callback_error`
      )
    }
  }

  // Fallback: redirect to login if no code
  return NextResponse.redirect(`${origin}/auth/login`)
}