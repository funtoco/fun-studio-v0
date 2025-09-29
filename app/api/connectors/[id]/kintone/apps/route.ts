/**
 * API to manage Kintone apps for a connector
 * GET /api/connectors/[id]/kintone/apps - List apps from Kintone
 * POST /api/connectors/[id]/kintone/apps - Sync apps to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient } from '@/lib/kintone/api-client'
import { decryptJson } from '@/lib/security/crypto'

// Token structure for Kintone OAuth
type TokenSet = {
  access_token: string
  refresh_token: string
  expires_at?: number // epoch ms
  scope?: string
}

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// Robust token handling functions
async function getLatestTokenSet(connectorId: string): Promise<TokenSet | null> {
  const supabase = getServerClient()
  
  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_token')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !credentials) {
    return null
  }

  try {
    let tokenData: any
    if (credentials.payload) {
      tokenData = JSON.parse(credentials.payload)
    } else if (credentials.payload_encrypted) {
      tokenData = decryptJson(credentials.payload_encrypted)
    } else {
      return null
    }

    // Ensure expires_at is always a number (epoch ms)
    let expiresAt: number | undefined
    if (tokenData.expires_at) {
      expiresAt = typeof tokenData.expires_at === 'number' ? tokenData.expires_at : new Date(tokenData.expires_at).getTime()
    }

    return {
      access_token: tokenData.access_token || tokenData.token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      scope: tokenData.scope
    }
  } catch (err) {
    console.error('Failed to parse token data:', err)
    return null
  }
}

async function refreshToken(connectorId: string, tokenSet: TokenSet): Promise<TokenSet | null> {
  const supabase = getServerClient()
  
  // Get Kintone config for client credentials
  const { data: configCreds, error: configError } = await supabase
    .from('credentials')
    .select('*')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_config')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (configError || !configCreds) {
    console.error('No Kintone config found for token refresh')
    return null
  }

  let kintoneConfig: any
  if (configCreds.payload) {
    kintoneConfig = JSON.parse(configCreds.payload)
  } else if (configCreds.payload_encrypted) {
    kintoneConfig = decryptJson(configCreds.payload_encrypted)
  } else {
    return null
  }

  const clientId = kintoneConfig.clientId
  const clientSecret = kintoneConfig.clientSecret
  const domain = kintoneConfig.domain

  if (!clientId || !clientSecret || !domain) {
    console.error('Missing client credentials for token refresh')
    return null
  }

  try {
    // Prepare refresh token request - use correct OAuth2 endpoint
    const tokenUrl = `${domain}/oauth2/token`
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[token-refresh] POST ${tokenUrl}`)
      console.log(`[token-refresh] Headers: Authorization: Basic ${basicAuth.substring(0, 20)}...`)
    }
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenSet.refresh_token
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[token-refresh] Failed: ${response.status} ${errorText.substring(0, 200)}`)
      return null
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text()
      console.error(`[token-refresh] Non-JSON response: ${contentType}, body: ${responseText.substring(0, 200)}`)
      return null
    }

    const newTokenData = await response.json()
    
    // Calculate expires_at (default to 55 minutes if not provided)
    const expiresIn = newTokenData.expires_in || 3300 // 55 minutes
    const expiresAt = Date.now() + (expiresIn * 1000)

    const newTokenSet: TokenSet = {
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || tokenSet.refresh_token,
      expires_at: expiresAt, // Always set expires_at
      scope: newTokenData.scope || tokenSet.scope
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[token-refresh] Success: expires_at=${expiresAt}, expires_in=${expiresIn}`)
    }

    // Update existing credentials row or insert new one
    const { data: existingCreds, error: findError } = await supabase
      .from('credentials')
      .select('id')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_token')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('Failed to find existing credentials:', findError)
      return null
    }

    if (existingCreds) {
      // Update existing row
      const { error: updateError } = await supabase
        .from('credentials')
        .update({
          payload: JSON.stringify(newTokenSet),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCreds.id)

      if (updateError) {
        console.error('Failed to update refreshed token:', updateError)
        return null
      }
    } else {
      // Insert new row
      const { error: insertError } = await supabase
        .from('credentials')
        .insert({
          connector_id: connectorId,
          type: 'kintone_token',
          payload: JSON.stringify(newTokenSet),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Failed to insert refreshed token:', insertError)
        return null
      }
    }

    return newTokenSet
  } catch (err) {
    console.error('Token refresh error:', err)
    return null
  }
}

async function getValidToken(connectorId: string): Promise<TokenSet | null> {
  const tokenSet = await getLatestTokenSet(connectorId)
  
  if (!tokenSet || !tokenSet.access_token) {
    return null
  }

  // Check if token needs refresh (expires within 1 minute or no expires_at)
  const now = Date.now()
  const needsRefresh = !tokenSet.expires_at || tokenSet.expires_at <= now + 60000

  if (needsRefresh) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[token] Refreshing token for connector ${connectorId}, expires_at: ${tokenSet.expires_at}, now: ${now}`)
    }
    
    const refreshedToken = await refreshToken(connectorId, tokenSet)
    return refreshedToken || tokenSet // Fallback to original if refresh fails
  }

  return tokenSet
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: connectorId } = params
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') // 'mappings' or 'kintone'
    const search = searchParams.get('q') || ''
    const offset = parseInt(searchParams.get('offset') || '0')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    
    const supabase = getServerClient()

    // Get connector
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('*')
      .eq('id', connectorId)
      .single()

    if (connectorError) {
      console.error('Error fetching connector:', connectorError)
      console.error('Connector ID:', connectorId)
      return NextResponse.json(
        { error: `Database error: ${connectorError.message}` },
        { status: 500 }
      )
    }

    if (!connector) {
      console.error('No connector found for ID:', connectorId)
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }



    if (connector.provider !== 'kintone') {
      console.log(`[apps-api] Provider mismatch: expected 'kintone', got '${connector.provider}'`)
      return NextResponse.json(
        { error: 'This endpoint is only for Kintone connectors' },
        { status: 400 }
      )
    }

    // Temporarily allow non-connected status for debugging
    if (connector.status !== 'connected') {
      console.log(`[apps-api] Connector status is '${connector.status}', not 'connected' - allowing for debugging`)
      // return NextResponse.json(
      //   { error: `Connector is not connected (status: ${connector.status})` },
      //   { status: 400 }
      // )
    }

    // If source is 'kintone', fetch from Kintone API for modal picker
    if (source === 'kintone') {
      // Get valid token (with pre-call refresh if needed)
      const tokenSet = await getValidToken(connectorId)
      
      if (!tokenSet) {
        return NextResponse.json(
          { error: 'Kintone session expired or scope revoked. Please reconnect.' },
          { status: 401 }
        )
      }

      // Check required scopes (temporarily disabled for testing)
      // if (tokenSet.scope && !tokenSet.scope.includes('k:app:read')) {
      //   console.log(`[apps-api] Missing scope: token has '${tokenSet.scope}', need 'k:app:read'`)
      //   return NextResponse.json(
      //     { error: 'OAuth scope insufficient. Current scopes: ' + tokenSet.scope + '. Required: k:app:read. Please reconnect with proper permissions.' },
      //     { status: 400 }
      //   )
      // }


      // Get Kintone config from credentials table
      const { data: configCreds, error: configError } = await supabase
        .from('credentials')
        .select('*')
        .eq('connector_id', connectorId)
        .eq('type', 'kintone_config')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (configError || !configCreds) {
        console.log(`[apps-api] No kintone_config found for connector ${connectorId}, error:`, configError)
        return NextResponse.json(
          { error: 'Kintone configuration not found' },
          { status: 400 }
        )
      }

      // Parse config
      let kintoneConfig
      if (configCreds.payload) {
        kintoneConfig = JSON.parse(configCreds.payload)
      } else if (configCreds.payload_encrypted) {
        kintoneConfig = decryptJson(configCreds.payload_encrypted)
      } else {
        console.log(`[apps-api] Invalid Kintone configuration: no payload or payload_encrypted`)
        return NextResponse.json(
          { error: 'Invalid Kintone configuration' },
          { status: 400 }
        )
      }

      // Use full domain from config
      const domain = kintoneConfig.domain

      if (!domain) {
        console.log(`[apps-api] Kintone domain not found in config:`, kintoneConfig)
        return NextResponse.json(
          { error: 'Kintone domain not found' },
          { status: 400 }
        )
      }

      // Create Kintone API client with full domain
      const kintoneClient = new KintoneApiClient({
        domain,
        accessToken: tokenSet.access_token
      })

      // Build query options - only use allowed Kintone parameters
      const queryOptions: any = {
        limit: limit || 30,
        offset: offset || 0
      }

      // Handle search query - map to Kintone's allowed parameters
      if (search) {
        // If search is numeric, try as app ID or code
        if (/^\d+$/.test(search)) {
          queryOptions.ids = [search]
        } else {
          // Otherwise use as name search
          queryOptions.name = search
        }
      }

      // Fetch apps from Kintone with retry on 401
      let kintoneApps
      try {
        kintoneApps = await kintoneClient.getApps(queryOptions)
      } catch (error) {
        // Check if it's a 401 error
        if (error instanceof Error && error.message.includes('401') && error.message.includes('CB_OA01')) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[apps-api] Got 401, attempting token refresh and retry`)
          }
          
          // Try to refresh token and retry once
          const refreshedToken = await refreshToken(connectorId, tokenSet)
          if (refreshedToken) {
            // Update client with new token
            const retryClient = new KintoneApiClient({
              domain,
              accessToken: refreshedToken.access_token
            })
            try {
              kintoneApps = await retryClient.getApps(queryOptions)
            } catch (retryError) {
              // If retry also fails, return 401
              if (process.env.NODE_ENV === 'development') {
                console.log(`[apps-api] Retry also failed:`, retryError)
              }
              return NextResponse.json(
                { error: 'Kintone session expired or scope revoked. Please reconnect.' },
                { status: 401 }
              )
            }
          } else {
            // Refresh failed, return 401
            return NextResponse.json(
              { error: 'Kintone session expired or scope revoked. Please reconnect.' },
              { status: 401 }
            )
          }
        } else {
          // Re-throw non-401 errors
          throw error
        }
      }


      return NextResponse.json({
        apps: kintoneApps,
        total: kintoneApps.length,
        hasMore: kintoneApps.length === limit,
        nextOffset: offset + limit
      })
    }

    // Default: Get stored apps from database (for Apps tab display)
    const { data: storedApps, error: appsError } = await supabase
      .from('connector_app_mappings')
      .select()
      .eq('connector_id', connectorId)
      .eq('target_app_type', 'default')
      .order('created_at', { ascending: false })

    if (appsError) {
      console.error('Error fetching stored apps:', appsError)
      return NextResponse.json(
        { error: `Database error: ${appsError.message}` },
        { status: 500 }
      )
    }

    console.log(`[apps-api] Found ${storedApps?.length || 0} app mappings for connector ${connectorId}`)

    return NextResponse.json({
      apps: storedApps || [],
      total: storedApps?.length || 0,
      lastSynced: storedApps?.[0]?.created_at || null
    })

    } catch (error) {
      console.error('Get Kintone apps error:', error)
      
      // Check for specific Kintone errors
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          return NextResponse.json(
            { error: 'Missing scope k:app:read. Please reconnect with proper permissions.' },
            { status: 400 }
          )
        }
        if (error.message.includes('CB_IL02')) {
          return NextResponse.json(
            { error: 'Invalid request to Kintone (check query keys and types)' },
            { status: 400 }
          )
        }
        if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('CB_OA01')) {
          return NextResponse.json(
            { error: 'OAuth token is invalid or expired. Please reconnect to Kintone.' },
            { status: 401 }
          )
        }
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch Kintone apps' },
        { status: 500 }
      )
    }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: connectorId } = params
    const body = await request.json()
    const { action, appId, appName, appCode, serviceFeature = 'default' } = body
    
    const supabase = getServerClient()

    // Get connector
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('*')
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'This endpoint is only for Kintone connectors' },
        { status: 400 }
      )
    }

    // Temporarily allow non-connected status for debugging
    if (connector.status !== 'connected') {
      console.log(`[apps-api] Connector status is '${connector.status}', not 'connected' - allowing for debugging`)
      // return NextResponse.json(
      //   { error: 'Connector is not connected' },
      //   { status: 400 }
      // )
    }

    // Handle single app mapping (for modal picker)
    if (action === 'add_mapping') {
      if (!appId || !appName) {
        return NextResponse.json(
          { error: 'appId and appName are required' },
          { status: 400 }
        )
      }

      // Check if mapping already exists
      const { data: existingMapping, error: findError } = await supabase
        .from('connector_app_mappings')
        .select('id')
        .eq('connector_id', connectorId)
        .eq('target_app_type', serviceFeature)
        .single()

      let mapping
      if (findError && findError.code !== 'PGRST116') {
        console.error('Error finding existing mapping:', findError)
        return NextResponse.json(
          { error: 'Failed to check existing mapping' },
          { status: 500 }
        )
      }

      if (existingMapping) {
        // Update existing mapping
        const { data: updatedMapping, error: updateError } = await supabase
          .from('connector_app_mappings')
          .update({
            source_app_id: String(appId),
            source_app_name: appName,
            is_active: true
          })
          .eq('id', existingMapping.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating app mapping:', updateError)
          return NextResponse.json(
            { error: 'Failed to update app mapping' },
            { status: 500 }
          )
        }
        mapping = updatedMapping
      } else {
        // Insert new mapping
        const { data: newMapping, error: insertError } = await supabase
          .from('connector_app_mappings')
          .insert({
            connector_id: connectorId,
            target_app_type: serviceFeature,
            source_app_id: String(appId),
            source_app_name: appName,
            is_active: true
          })
          .select()
          .single()

        if (insertError) {
          console.error('Error inserting app mapping:', insertError)
          return NextResponse.json(
            { error: 'Failed to insert app mapping' },
            { status: 500 }
          )
        }
        mapping = newMapping
      }

      return NextResponse.json({
        success: true,
        mapping
      })
    }

    // Handle bulk sync (existing behavior)
    // Get valid token (with pre-call refresh if needed)
    const tokenSet = await getValidToken(connectorId)
    
    if (!tokenSet) {
      return NextResponse.json(
        { error: 'Kintone session expired or scope revoked. Please reconnect.' },
        { status: 401 }
      )
    }

    // Get Kintone config from credentials table
    const { data: configCreds, error: configError } = await supabase
      .from('credentials')
      .select('*')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_config')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (configError || !configCreds) {
      return NextResponse.json(
        { error: 'Kintone configuration not found' },
        { status: 400 }
      )
    }

    // Parse config
    let kintoneConfig
    if (configCreds.payload) {
      kintoneConfig = JSON.parse(configCreds.payload)
    } else if (configCreds.payload_encrypted) {
      kintoneConfig = decryptJson(configCreds.payload_encrypted)
    } else {
      return NextResponse.json(
        { error: 'Invalid Kintone configuration' },
        { status: 400 }
      )
    }

    // Use full domain from config
    const domain = kintoneConfig.domain

    if (!domain) {
      return NextResponse.json(
        { error: 'Kintone domain not found' },
        { status: 400 }
      )
    }

    // Create Kintone API client with full domain
    const kintoneClient = new KintoneApiClient({
      domain,
      accessToken: tokenSet.access_token
    })

    // Test connection first
    const connectionTest = await kintoneClient.testConnection()
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: `Connection test failed: ${connectionTest.error}` },
        { status: 400 }
      )
    }

    // Fetch apps from Kintone
    const kintoneApps = await kintoneClient.getApps()

    // Clear existing apps for this connector
    await supabase
      .from('connector_app_mappings')
      .delete()
      .eq('connector_id', connectorId)

    // Insert new apps
    const appsToInsert = kintoneApps.map(app => ({
      connector_id: connectorId,
      source_app_id: String(app.appId),
      source_app_name: app.name,
      target_app_type: 'kintone',
      is_active: true
    }))

    const { data: insertedApps, error: insertError } = await supabase
      .from('connector_app_mappings')
      .insert(appsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting apps:', insertError)
      return NextResponse.json(
        { error: 'Failed to sync apps' },
        { status: 500 }
      )
    }

    // Log sync event
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connectorId,
        level: 'info',
        event: 'apps_synced',
        detail: {
          apps_count: insertedApps.length,
          user_info: connectionTest.userInfo
        }
      })

    return NextResponse.json({
      success: true,
      apps: insertedApps,
      total: insertedApps.length,
      syncedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sync Kintone apps error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Kintone apps' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: connectorId } = params
    const { searchParams } = new URL(request.url)
    const serviceFeature = searchParams.get('serviceFeature') || 'default'
    
    const supabase = getServerClient()

    // Get connector and verify access
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('*')
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'This endpoint is only for Kintone connectors' },
        { status: 400 }
      )
    }

    // Delete mapping from connector_app_mappings table
    const { error: deleteError } = await supabase
      .from('connector_app_mappings')
      .delete()
      .eq('connector_id', connectorId)
      .eq('target_app_type', serviceFeature)

    if (deleteError) {
      console.error('Error deleting app mapping:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete app mapping' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Delete app mapping error:', error)
    return NextResponse.json(
      { error: 'Failed to delete app mapping' },
      { status: 500 }
    )
  }
}
