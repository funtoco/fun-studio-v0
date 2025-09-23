import { NextRequest, NextResponse } from 'next/server'
import { updateConnector } from '@/lib/supabase/connectors-v2'
import { createClient } from '@supabase/supabase-js'
import { encryptJson } from '@/lib/security/crypto'
import { z } from 'zod'

export const runtime = 'nodejs'

// DELETE /api/admin/connectors/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      )
    }

    // Use service role to bypass RLS and cascade delete related rows
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server Supabase config missing' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    // Delete children first to be safe, then connector
    // Get kintone_apps IDs first
    const { data: kintoneApps } = await supabase
      .from('kintone_apps')
      .select('id')
      .eq('connector_id', id)
    
    if (kintoneApps && kintoneApps.length > 0) {
      const appIds = kintoneApps.map(app => app.id)
      // Delete kintone_fields first
      await supabase.from('kintone_fields').delete().in('kintone_app_id', appIds)
    }
    
    // Get mappings_apps IDs first
    const { data: mappingsApps } = await supabase
      .from('mappings_apps')
      .select('id')
      .eq('connector_id', id)
    
    if (mappingsApps && mappingsApps.length > 0) {
      const mappingIds = mappingsApps.map(mapping => mapping.id)
      // Delete mappings_fields first
      await supabase.from('mappings_fields').delete().in('mapping_app_id', mappingIds)
    }
    
    // Delete Kintone-related data
    await supabase.from('kintone_apps').delete().eq('connector_id', id)
    await supabase.from('mappings_apps').delete().eq('connector_id', id)
    
    // Delete connector-related data
    await supabase.from('connector_logs').delete().eq('connector_id', id)
    await supabase.from('oauth_credentials').delete().eq('connector_id', id)
    await supabase.from('connector_secrets').delete().eq('connector_id', id)
    
    // Finally delete the connector
    const { error } = await supabase.from('connectors').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting connector:', error)
    return NextResponse.json(
      { error: 'Failed to delete connector' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/connectors/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      provider_config: z.record(z.any()).optional(),
      scopes: z.array(z.string()).optional(),
      clientId: z.string().min(1).optional(),
      clientSecret: z.string().min(1).optional(),
    })

    const validatedData = updateSchema.parse(body)

    if (!id) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      )
    }

    // Update connector core fields
    const { clientId, clientSecret, ...core } = validatedData
    const updatedConnector = await updateConnector(id, core)

    // If clientId/Secret provided, update secrets table with service role
    if (clientId && clientSecret) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: 'Server Supabase config missing' }, { status: 500 })
      }
      const supabase = createClient(supabaseUrl, serviceKey)

      const clientIdEnc = encryptJson({ value: clientId })
      const clientSecretEnc = encryptJson({ value: clientSecret })

      const { error: upsertErr } = await supabase
        .from('connector_secrets')
        .upsert({
          connector_id: id,
          oauth_client_id_enc: clientIdEnc,
          oauth_client_secret_enc: clientSecretEnc,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'connector_id' })

      if (upsertErr) {
        return NextResponse.json({ error: 'Failed to update credentials' }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      success: true, 
      connector: updatedConnector 
    })
  } catch (error) {
    console.error('Error updating connector:', error)
    return NextResponse.json(
      { error: 'Failed to update connector' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/connectors/[id] - untuk update status connector
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const patchSchema = z.object({
      status: z.enum(['connected', 'disconnected', 'error']).optional(),
      error_message: z.string().optional(),
    })

    const validatedData = patchSchema.parse(body)

    if (!id) {
      return NextResponse.json(
        { error: 'Connector ID is required' },
        { status: 400 }
      )
    }

    // Use service role to update connector status
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server Supabase config missing' }, { status: 500 })
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    const { data, error } = await supabase
      .from('connectors')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      connector: data 
    })
  } catch (error) {
    console.error('Error patching connector:', error)
    return NextResponse.json(
      { error: 'Failed to patch connector' },
      { status: 500 }
    )
  }
}
