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

    // Get stored fields from database
    const { data: storedFields, error: fieldsError } = await supabase
      .from('kintone_fields')
      .select(`
        *,
        kintone_apps!inner(app_id)
      `)
      .eq('kintone_apps.connector_id', connectorId)
      .eq('kintone_apps.app_id', appId)
      .order('field_label')

    if (fieldsError) {
      console.error('Error fetching stored fields:', fieldsError)
      return NextResponse.json(
        { error: 'Failed to fetch stored fields' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      fields: storedFields || [],
      total: storedFields?.length || 0,
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

    // Get the kintone_app record
    const { data: kintoneApp, error: appError } = await supabase
      .from('kintone_apps')
      .select('*')
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
