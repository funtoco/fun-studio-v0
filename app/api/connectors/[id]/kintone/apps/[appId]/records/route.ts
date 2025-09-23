/**
 * API to manage Kintone app records
 * GET /api/connectors/[id]/kintone/apps/[appId]/records - List records from an app
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
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || undefined
    const fields = searchParams.get('fields')?.split(',') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')

    const supabase = getServerClient()

    // Get connector and its credentials
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select(`
        *,
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

    // Build query with limit
    const kintoneQuery = query ? `${query} limit ${limit}` : `limit ${limit}`

    // Fetch records from Kintone
    const records = await kintoneClient.getRecords(appId, kintoneQuery, fields)

    // Transform records to a more usable format
    const transformedRecords = records.map(record => {
      const transformed: any = {
        id: record.$id.value,
        revision: record.$revision.value
      }

      // Flatten field values
      Object.entries(record).forEach(([key, value]) => {
        if (key.startsWith('$')) return // Skip system fields
        
        if (value && typeof value === 'object' && 'value' in value) {
          transformed[key] = value.value
        } else {
          transformed[key] = value
        }
      })

      return transformed
    })

    return NextResponse.json({
      records: transformedRecords,
      total: transformedRecords.length,
      appId,
      query: kintoneQuery
    })

  } catch (error) {
    console.error('Get Kintone records error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Kintone records' },
      { status: 500 }
    )
  }
}
