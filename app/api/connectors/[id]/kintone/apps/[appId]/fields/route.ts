/**
 * API to manage Kintone app fields
 * GET /api/connectors/[id]/kintone/apps/[appId]/fields - List fields for an app
 * POST /api/connectors/[id]/kintone/apps/[appId]/fields - Sync fields to database
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
  { params }: { params: { id: string; appId: string } }
) {
  try {
    const { id: connectorId, appId } = params
    const supabase = getServerClient()

    // Get connector info
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select()
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

    // Get OAuth credentials to fetch fields from Kintone
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

    // Fetch fields from Kintone API
    const kintoneFields = await kintoneClient.getAppFields(parseInt(appId))

    return NextResponse.json({
      fields: kintoneFields || [],
      total: kintoneFields?.length || 0,
      appId
    })

  } catch (error) {
    console.error('Get Kintone fields error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Kintone fields' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  try {
    const { id: connectorId, appId } = params
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

    if (connector.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector is not connected' },
        { status: 400 }
      )
    }

    // Get OAuth credentials from credentials table
    const { data: oauthCreds, error: credsError } = await supabase
      .from('credentials')
      .select('*')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_token')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (credsError || !oauthCreds) {
      return NextResponse.json(
        { error: 'No OAuth credentials found' },
        { status: 400 }
      )
    }

    // Decrypt access token from credentials table
    let accessToken
    if (oauthCreds.payload) {
      // Plain text payload
      const tokenData = JSON.parse(oauthCreds.payload)
      accessToken = tokenData.token || tokenData.access_token
    } else if (oauthCreds.payload_encrypted) {
      // Encrypted payload
      const accessTokenData = decryptJson(oauthCreds.payload_encrypted)
      accessToken = accessTokenData.token || accessTokenData.value || accessTokenData.access_token
    } else {
      throw new Error('No valid token payload found')
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
      accessToken
    })

    // Get the kintone_app record
    const { data: kintoneApp, error: appError } = await supabase
      .from('kintone_apps')
      .select()
      .eq('connector_id', connectorId)
      .eq('app_id', appId)
      .single()

    if (appError || !kintoneApp) {
      return NextResponse.json(
        { error: 'Kintone app not found. Please sync apps first.' },
        { status: 404 }
      )
    }

    // Fetch fields from Kintone
    const kintoneFields = await kintoneClient.getAppFields(appId)

    // Clear existing fields for this app
    await supabase
      .from('kintone_fields')
      .delete()
      .eq('kintone_app_id', kintoneApp.id)

    // Insert new fields
    const fieldsToInsert = kintoneFields.map(field => ({
      kintone_app_id: kintoneApp.id,
      field_code: field.code,
      field_label: field.label,
      field_type: field.type,
      required: field.required,
      options: field.options || null
    }))

    const { data: insertedFields, error: insertError } = await supabase
      .from('kintone_fields')
      .insert(fieldsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting fields:', insertError)
      return NextResponse.json(
        { error: 'Failed to sync fields' },
        { status: 500 }
      )
    }

    // Log sync event
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connectorId,
        level: 'info',
        event: 'fields_synced',
        detail: {
          app_id: appId,
          app_name: kintoneApp.name,
          fields_count: insertedFields.length
        }
      })

    return NextResponse.json({
      success: true,
      fields: insertedFields,
      total: insertedFields.length,
      appId,
      syncedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sync Kintone fields error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Kintone fields' },
      { status: 500 }
    )
  }
}
