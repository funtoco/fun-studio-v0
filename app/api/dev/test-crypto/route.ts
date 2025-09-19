/**
 * Development-only crypto testing endpoint
 * GET /api/dev/test-crypto
 */

import { NextResponse } from 'next/server'
import { testConnectorSystem } from '@/lib/testing/crypto-test'

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }
  
  try {
    console.log('=== Connector System Test ===')
    await testConnectorSystem()
    
    return NextResponse.json({
      success: true,
      message: 'Connector system tests completed. Check server logs for details.',
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MOCK_OAUTH: process.env.MOCK_OAUTH,
        hasConnectorSecret: !!process.env.CONNECTOR_STATE_SECRET,
        hasEncryptionKey: !!process.env.CREDENTIALS_ENC_KEY,
        hasSupabaseConfig: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      }
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
