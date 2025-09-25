/**
 * API to manage Kintone apps for a connector
 * GET /api/connectors/[id]/kintone/apps - List apps from Kintone
 * POST /api/connectors/[id]/kintone/apps - Sync apps to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient } from '@/lib/kintone/api-client'
import { decryptJson } from '@/lib/security/crypto'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: connectorId } = params
    const supabase = getServerClient()

    // Get connector and its credentials
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select(`
        *,
        connector_secrets(*),
        oauth_credentials(*)
      `)
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

    if (connector.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector is not connected' },
        { status: 400 }
      )
    }

    // Get stored apps from database
    const { data: storedApps, error: appsError } = await supabase
      .from('kintone_apps')
      .select()
      .eq('connector_id', connectorId)
      .order('name')

    if (appsError) {
      console.error('Error fetching stored apps:', appsError)
      return NextResponse.json(
        { error: 'Failed to fetch stored apps' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      apps: storedApps || [],
      total: storedApps?.length || 0,
      lastSynced: storedApps?.[0]?.last_synced_at || null
    })

  } catch (error) {
    console.error('Get Kintone apps error:', error)
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
    const supabase = getServerClient()

    // Get connector and its credentials
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select(`
        *,
        connector_secrets(*),
        oauth_credentials(*)
      `)
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

    if (connector.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector is not connected' },
        { status: 400 }
      )
    }

    // Get OAuth credentials
    const oauthCreds = connector.oauth_credentials?.[0]
    if (!oauthCreds) {
      return NextResponse.json(
        { error: 'No OAuth credentials found' },
        { status: 400 }
      )
    }

    // Decrypt access token
    const accessTokenData = decryptJson(oauthCreds.access_token_enc)
    const accessToken = accessTokenData.token || accessTokenData.value

    // Create Kintone API client
    const kintoneClient = new KintoneApiClient({
      subdomain: connector.provider_config.subdomain,
      accessToken
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
      .from('kintone_apps')
      .delete()
      .eq('connector_id', connectorId)

    // Insert new apps
    const appsToInsert = kintoneApps.map(app => ({
      connector_id: connectorId,
      app_id: app.appId,
      code: app.code,
      name: app.name,
      description: app.description || '',
      space_id: app.spaceId || null,
      thread_id: app.threadId || null,
      last_synced_at: new Date().toISOString()
    }))

    const { data: insertedApps, error: insertError } = await supabase
      .from('kintone_apps')
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
