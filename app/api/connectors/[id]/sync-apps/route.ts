/**
 * Sync Kintone apps from connector
 * POST /api/connectors/[id]/sync-apps
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector, getConnectionStatus } from '@/lib/db/connectors'
import { loadKintoneClientConfig } from '@/lib/db/credential-loader'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Get Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// Get Kintone apps from API
async function getKintoneApps(config: any, accessToken: string) {
  const response = await fetch(`https://${config.domain}.cybozu.com/k/v1/apps.json`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch Kintone apps: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.apps || []
}

// Get Kintone app fields
async function getKintoneAppFields(config: any, accessToken: string, appId: string) {
  const response = await fetch(`https://${config.domain}.cybozu.com/k/v1/app/form/fields.json?app=${appId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch app fields: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.properties || {}
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connectorId = params.id
    
    console.log(`[sync-apps] Starting sync for connectorId=${connectorId}`)
    
    // Get connector and check if connected
    const connector = await getConnector(connectorId)
    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    const connectionStatus = await getConnectionStatus(connectorId)
    if (connectionStatus?.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector not connected' },
        { status: 400 }
      )
    }

    // Load Kintone config and get access token
    const config = await loadKintoneClientConfig(connectorId)
    
    // For now, we'll use a mock access token since we haven't implemented token exchange yet
    // TODO: Get real access token from credentials table
    const accessToken = 'mock-access-token'
    
    // Mock Kintone apps data for testing
    const mockKintoneApps = [
      {
        appId: '1',
        code: 'people',
        name: '人材管理',
        description: '人材情報を管理するアプリ',
        spaceId: null,
        threadId: null
      },
      {
        appId: '2', 
        code: 'visa',
        name: 'ビザ管理',
        description: 'ビザ申請・更新を管理するアプリ',
        spaceId: null,
        threadId: null
      },
      {
        appId: '3',
        code: 'meetings',
        name: '面談記録',
        description: '面談の記録を管理するアプリ',
        spaceId: null,
        threadId: null
      }
    ]
    
    // Mock fields data
    const mockFields = {
      '1': {
        'name': { label: '氏名', type: 'SINGLE_LINE_TEXT', required: true },
        'email': { label: 'メールアドレス', type: 'SINGLE_LINE_TEXT', required: true },
        'phone': { label: '電話番号', type: 'SINGLE_LINE_TEXT', required: false },
        'department': { label: '部署', type: 'DROP_DOWN', required: false, options: { choices: [{ label: '開発部' }, { label: '営業部' }] } }
      },
      '2': {
        'visa_type': { label: 'ビザ種類', type: 'DROP_DOWN', required: true, options: { choices: [{ label: '技術・人文知識・国際業務' }, { label: '永住者' }] } },
        'expiry_date': { label: '有効期限', type: 'DATE', required: true },
        'status': { label: 'ステータス', type: 'DROP_DOWN', required: true, options: { choices: [{ label: '申請中' }, { label: '承認済み' }] } }
      },
      '3': {
        'meeting_date': { label: '面談日', type: 'DATE', required: true },
        'participants': { label: '参加者', type: 'MULTI_LINE_TEXT', required: false },
        'notes': { label: '備考', type: 'MULTI_LINE_TEXT', required: false }
      }
    }
    
    console.log(`[sync-apps] Using mock data for testing...`)
    
    // Use mock data for now
    const kintoneApps = mockKintoneApps
    
    console.log(`[sync-apps] Found ${kintoneApps.length} apps`)
    
    const supabase = getServerClient()
    
    // Clear existing apps for this connector
    await supabase
      .from('kintone_apps')
      .delete()
      .eq('connector_id', connectorId)
    
    // Insert new apps
    const appsToInsert = kintoneApps.map((app: any) => ({
      connector_id: connectorId,
      app_id: app.appId,
      code: app.code,
      name: app.name,
      description: app.description || null,
      space_id: app.spaceId || null,
      thread_id: app.threadId || null,
      last_synced_at: new Date().toISOString()
    }))
    
    const { error: appsError } = await supabase
      .from('kintone_apps')
      .insert(appsToInsert)
    
    if (appsError) {
      throw new Error(`Failed to insert apps: ${appsError.message}`)
    }
    
    console.log(`[sync-apps] Successfully synced ${kintoneApps.length} apps`)
    
    // For each app, get its fields
    let totalFields = 0
    for (const app of kintoneApps) {
      try {
        console.log(`[sync-apps] Processing fields for app ${app.appId} (${app.name})`)
        
        // Use mock fields data
        const fields = mockFields[app.appId] || {}
        
        // Get the kintone_app_id from the database
        const { data: kintoneApp } = await supabase
          .from('kintone_apps')
          .select('id')
          .eq('connector_id', connectorId)
          .eq('app_id', app.appId)
          .single()
        
        if (kintoneApp) {
          // Clear existing fields for this app
          await supabase
            .from('kintone_fields')
            .delete()
            .eq('kintone_app_id', kintoneApp.id)
          
          // Insert new fields
          const fieldsToInsert = Object.entries(fields).map(([fieldCode, fieldData]: [string, any]) => ({
            kintone_app_id: kintoneApp.id,
            field_code: fieldCode,
            field_label: fieldData.label,
            field_type: fieldData.type,
            required: fieldData.required || false,
            options: fieldData.options || null
          }))
          
          if (fieldsToInsert.length > 0) {
            const { error: fieldsError } = await supabase
              .from('kintone_fields')
              .insert(fieldsToInsert)
            
            if (fieldsError) {
              console.error(`[sync-apps] Failed to insert fields for app ${app.appId}:`, fieldsError)
            } else {
              totalFields += fieldsToInsert.length
              console.log(`[sync-apps] Synced ${fieldsToInsert.length} fields for app ${app.appId}`)
            }
          }
        }
      } catch (error) {
        console.error(`[sync-apps] Failed to sync fields for app ${app.appId}:`, error)
        // Continue with other apps
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${kintoneApps.length} apps and ${totalFields} fields`,
      appsCount: kintoneApps.length,
      fieldsCount: totalFields
    })
    
  } catch (error: any) {
    console.error('[sync-apps] Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
