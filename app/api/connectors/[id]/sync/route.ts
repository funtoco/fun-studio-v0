/**
 * Data synchronization endpoint
 * POST /api/connectors/[id]/sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSyncService } from '@/lib/sync/kintone-sync'
import { getConnector, setConnectorStatus } from '@/lib/db/connectors'
import { revalidatePath } from 'next/cache'

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Validation schema
const syncRequestSchema = z.object({
  tenantId: z.string().uuid(),
  force: z.boolean().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connectorId = params.id
    const body = await request.json()
    
    // Validate input
    const { tenantId, force } = syncRequestSchema.parse(body)
    
    // Get and validate connector
    const connector = await getConnector(connectorId)
    
    if (!connector || connector.tenant_id !== tenantId) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    if (connector.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector must be connected to sync data' },
        { status: 400 }
      )
    }
    
    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'Only Kintone connectors support data sync' },
        { status: 400 }
      )
    }

    // Check for Mock OAuth
    if (process.env.MOCK_OAUTH === '1') {
      // Mock sync for development
      const mockResult = {
        success: true,
        synced: {
          people: Math.floor(Math.random() * 20) + 5,
          visas: Math.floor(Math.random() * 15) + 3
        },
        errors: [],
        duration: Math.floor(Math.random() * 3000) + 1000,
        mock: true
      }

      console.log('🧪 Mock data sync completed:', mockResult)
      
      return NextResponse.json({
        ...mockResult,
        message: 'Mock data sync completed successfully'
      })
    }

    // Real sync
    try {
      console.log(`🔄 Starting data sync for connector ${connectorId}`)
      
      // Create sync service
      const syncService = await createSyncService(connectorId)
      
      // Perform sync
      const result = await syncService.syncAll()
      
      console.log(`✅ Data sync completed:`, result)
      
      // Update connector status if there were errors
      if (result.errors.length > 0) {
        await setConnectorStatus(
          connectorId, 
          'error', 
          `Sync completed with ${result.errors.length} errors`
        )
      }
      
      // Revalidate data pages
      revalidatePath('/people', 'page')
      revalidatePath('/visas', 'page')
      revalidatePath(`/admin/connectors/${connectorId}`, 'page')
      
      return NextResponse.json({
        ...result,
        message: result.success 
          ? 'Data synchronization completed successfully'
          : 'Data synchronization completed with errors'
      })
      
    } catch (syncError) {
      console.error('Sync error:', syncError)
      
      const errorMessage = syncError instanceof Error 
        ? syncError.message 
        : 'Sync failed'
      
      // Update connector status
      await setConnectorStatus(connectorId, 'error', errorMessage)
      
      return NextResponse.json(
        { 
          success: false,
          error: errorMessage,
          synced: { people: 0, visas: 0 },
          errors: [errorMessage],
          duration: 0
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Sync request error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
