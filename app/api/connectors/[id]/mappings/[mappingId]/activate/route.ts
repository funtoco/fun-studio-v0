import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// POST /api/connectors/[id]/mappings/[mappingId]/activate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { mappingId } = params

    // Activate the mapping
    const { error: updateError } = await supabase
      .from('connector_app_mappings')
      .update({ is_active: true })
      .eq('id', mappingId)

    if (updateError) {
      console.error('Error activating mapping:', updateError)
      return NextResponse.json({ error: 'Failed to activate mapping' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mapping activated successfully',
      mappingId: mappingId,
      isActive: true
    })
  } catch (error) {
    console.error('Error in POST /api/connectors/[id]/mappings/[mappingId]/activate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
