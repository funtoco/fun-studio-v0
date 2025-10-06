import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/connectors/[id]/mappings/[mappingId]/deactivate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { mappingId } = params

    // Deactivate the mapping
    const { error: updateError } = await supabase
      .from('connector_app_mappings')
      .update({ is_active: false })
      .eq('id', mappingId)

    if (updateError) {
      console.error('Error deactivating mapping:', updateError)
      return NextResponse.json({ error: 'Failed to deactivate mapping' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mapping deactivated successfully',
      mappingId: mappingId,
      isActive: false
    })
  } catch (error) {
    console.error('Error in POST /api/connectors/[id]/mappings/[mappingId]/deactivate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
