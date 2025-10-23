/**
 * Scheduled data synchronization endpoint
 * POST /api/cron/sync
 * This endpoint is called by Vercel Cron Jobs for scheduled syncs
 */

import { NextRequest, NextResponse } from 'next/server'
import { createSyncService } from '@/lib/sync/kintone-sync'
import { getConnector, setConnectorStatus } from '@/lib/db/connectors'
import { createClient } from '@supabase/supabase-js'

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

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🕐 Starting scheduled sync process')
    
    const supabase = getServerClient()
    
    // Get all connected Kintone connectors
    const { data: connectors, error: connectorsError } = await supabase
      .from('connectors')
      .select('*')
      .eq('provider', 'kintone')
      .eq('status', 'connected')
    
    if (connectorsError) {
      throw new Error(`Failed to fetch connectors: ${connectorsError.message}`)
    }
    
    if (!connectors || connectors.length === 0) {
      console.log('ℹ️ No connected Kintone connectors found')
      return NextResponse.json({
        success: true,
        message: 'No connectors to sync',
        synced: 0
      })
    }
    
    const results = []
    
    // Sync each connector
    for (const connector of connectors) {
      try {
        
        // Create sync service for scheduled sync
        const syncService = await createSyncService(
          connector.id,
          connector.tenant_id,
          'scheduled'
        )
        
        // Perform sync
        const result = await syncService.syncAll()
        
        console.log(`✅ Scheduled sync completed for ${connector.name}:`, result)
        
        // Update connector status if there were errors
        if (result.errors.length > 0) {
          await setConnectorStatus(
            connector.id, 
            'error', 
            `Scheduled sync completed with ${result.errors.length} errors`
          )
        }
        
        results.push({
          connectorId: connector.id,
          connectorName: connector.name,
          tenantId: connector.tenant_id,
          ...result
        })
        
      } catch (error) {
        console.error(`❌ Scheduled sync failed for connector ${connector.id}:`, error)
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        // Update connector status
        await setConnectorStatus(connector.id, 'error', errorMessage)
        
        results.push({
          connectorId: connector.id,
          connectorName: connector.name,
          tenantId: connector.tenant_id,
          success: false,
          error: errorMessage,
          synced: { people: 0, visas: 0 },
          errors: [errorMessage],
          duration: 0
        })
      }
    }
    
    const totalSynced = results.reduce((sum, r) => sum + r.synced.people + r.synced.visas, 0)
    const successCount = results.filter(r => r.success).length
    const failedCount = results.length - successCount
    
    console.log(`🏁 Scheduled sync process completed: ${successCount} successful, ${failedCount} failed, ${totalSynced} total items synced`)
    
    return NextResponse.json({
      success: true,
      message: `Scheduled sync completed: ${successCount} successful, ${failedCount} failed`,
      totalConnectors: connectors.length,
      successfulConnectors: successCount,
      failedConnectors: failedCount,
      totalSynced,
      results
    })
    
  } catch (error) {
    console.error('❌ Scheduled sync process failed:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Scheduled sync process failed'
      },
      { status: 500 }
    )
  }
}
