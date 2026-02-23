import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const receivedSecret = request.headers.get('x-webhook-secret')
  const expectedSecret = process.env.N8N_WEBHOOK_SECRET
  
  return NextResponse.json({
    received_secret: receivedSecret,
    expected_secret_configured: expectedSecret ? 'YES' : 'NO',
    expected_secret_length: expectedSecret?.length || 0,
    match: receivedSecret === expectedSecret,
    debug: 'Webhook debug endpoint'
  })
}