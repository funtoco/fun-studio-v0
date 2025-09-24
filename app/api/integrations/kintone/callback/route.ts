/**
 * Kintone OAuth callback endpoint
 * GET /api/integrations/kintone/callback?code=xxx&state=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateConnectionStatus } from '@/lib/db/connectors-v2'
import { getConfigAndToken, computeRedirectUri } from '@/lib/connectors/kintoneClient'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Force Node.js runtime and disable static caching
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    console.log('🔗 OAuth Callback received')
    console.log('🔗 Code:', code ? 'Present' : 'Missing')
    console.log('🔗 State:', state ? 'Present' : 'Missing')
    console.log('🔗 Error:', error || 'None')
    
    if (error) {
      console.error('❌ OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=oauth_failed`)
    }
    
    if (!code || !state) {
      console.error('❌ Missing code or state parameter')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=missing_parameters`)
    }
    
    // Decode state parameter
    let stateData
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf8'))
    } catch (err) {
      console.error('❌ Failed to decode state:', err)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=invalid_state`)
    }
    
    const { tenantId, connectorId, returnTo } = stateData
    
    console.log('🔗 State data:', { tenantId, connectorId, returnTo })
    
    // Create admin client
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    
    // Load config only (token doesn't exist yet)
    const { data: configRow, error: configError } = await supabase
      .from('credentials')
      .select('payload')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_config')
      .single()
    
    if (configError || !configRow?.payload) {
      console.error('❌ Failed to load config:', configError?.message)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=config_not_found`)
    }
    
    const cfg = JSON.parse(configRow.payload)
    const redirectUri = computeRedirectUri(request)
    
    // Exchange code for token
    const tokenUrl = new URL(`${cfg.domain}/oauth2/token`)
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      redirect_uri: redirectUri,
      code: code
    })
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    })
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorText)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=token_exchange_failed`)
    }
    
    const tokenData = await tokenResponse.json()
    
    // Calculate expiry time
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + (tokenData.expires_in - 60)) // 60s buffer
    
    // Save token to database
    const { error: tokenError } = await supabase
      .from('credentials')
      .upsert({
        connector_id: connectorId,
        type: 'kintone_token',
        payload: JSON.stringify({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
          scope: tokenData.scope
        }),
        format: 'plain'
      }, { onConflict: 'connector_id,type' })
    
    if (tokenError) {
      console.error('❌ Failed to save token:', tokenError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=token_save_failed`)
    }
    
    // Update connection status
    await updateConnectionStatus(connectorId, 'connected')
    
    console.log('✅ OAuth flow completed successfully')
    
    // Redirect back to admin page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
    const redirectUrl = returnTo ? returnTo : `${baseUrl}/admin/connectors/${connectorId}?tenantId=${tenantId}&connected=true`
    return NextResponse.redirect(redirectUrl)
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/admin/connectors?error=callback_failed`)
  }
}