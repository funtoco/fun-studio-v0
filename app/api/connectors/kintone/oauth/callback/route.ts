import { NextRequest, NextResponse } from 'next/server'
import { createKintoneOAuthClient, DEFAULT_KINTONE_SCOPES } from '@/lib/connectors/kintone-oauth'
import { 
  getConnectorById, 
  storeOAuthTokens, 
  updateConnector,
  syncKintoneApps 
} from '@/lib/supabase/connectors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Handle OAuth error
    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/admin/connectors?error=${encodeURIComponent(error)}`, request.url)
      )
    }
    
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/admin/connectors?error=missing_parameters', request.url)
      )
    }
    
    // Parse state parameter (should contain connector ID and tenant slug)
    let connectorId: string
    let tenantSlug: string
    
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
      connectorId = stateData.connectorId
      tenantSlug = stateData.tenantSlug
    } catch (e) {
      console.error('Invalid state parameter:', e)
      return NextResponse.redirect(
        new URL('/admin/connectors?error=invalid_state', request.url)
      )
    }
    
    // Get connector from database
    const connector = await getConnectorById(connectorId, tenantSlug)
    if (!connector) {
      return NextResponse.redirect(
        new URL('/admin/connectors?error=connector_not_found', request.url)
      )
    }
    
    // Create OAuth client
    const oauthClient = createKintoneOAuthClient({
      subdomain: connector.subdomain!,
      clientId: connector.oauth_client_id!,
      clientSecret: process.env.KINTONE_CLIENT_SECRET!, // From env
      redirectUri: `${process.env.NEXTAUTH_URL}/api/connectors/kintone/oauth/callback`,
      scopes: DEFAULT_KINTONE_SCOPES
    })
    
    // Exchange code for tokens
    const tokens = await oauthClient.exchangeCodeForToken(code)
    
    // Store tokens in database
    await storeOAuthTokens(connectorId, tenantSlug, tokens)
    
    // Test connection and get user info
    const userInfo = await oauthClient.getUserInfo(tokens.access_token)
    console.log('Connected user:', userInfo)
    
    // Sync Kintone apps in background
    try {
      await syncKintoneApps(connectorId, tenantSlug, oauthClient, tokens.access_token)
    } catch (syncError) {
      console.error('Error syncing apps:', syncError)
      // Don't fail the OAuth flow, just log the error
    }
    
    // Redirect to connector detail page
    return NextResponse.redirect(
      new URL(`/admin/connectors/kintone?success=connected&connector=${connectorId}`, request.url)
    )
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Update connector status to error
    try {
      const { searchParams } = new URL(request.url)
      const state = searchParams.get('state')
      if (state) {
        const stateData = JSON.parse(Buffer.from(state, 'base64').toString())
        await updateConnector(stateData.connectorId, stateData.tenantSlug, {
          status: 'error',
          last_error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    } catch (e) {
      console.error('Error updating connector status:', e)
    }
    
    return NextResponse.redirect(
      new URL(`/admin/connectors?error=${encodeURIComponent('oauth_failed')}`, request.url)
    )
  }
}
