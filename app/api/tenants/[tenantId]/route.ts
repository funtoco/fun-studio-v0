import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/client"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is owner of the tenant
    const { data: userTenant, error: userTenantError } = await supabase
      .from('user_tenants')
      .select('role')
      .eq('tenant_id', params.tenantId)
      .eq('user_id', user.id)
      .single()

    if (userTenantError || !userTenant) {
      return NextResponse.json(
        { error: "Tenant not found or access denied" },
        { status: 404 }
      )
    }

    if (userTenant.role !== 'owner') {
      return NextResponse.json(
        { error: "Only tenant owners can delete tenants" },
        { status: 403 }
      )
    }

    // Use admin client for deletion to ensure all related data is deleted
    const adminSupabase = createAdminClient()
    
    try {
      // Delete tenant (this will cascade delete user_tenants due to foreign key constraint)
      const { error: deleteError } = await adminSupabase
        .from('tenants')
        .delete()
        .eq('id', params.tenantId)

      if (deleteError) {
        console.error('Error deleting tenant:', deleteError)
        return NextResponse.json(
          { error: "Failed to delete tenant" },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        message: "Tenant deleted successfully" 
      })
    } catch (error) {
      console.error('Error in tenant deletion process:', error)
      return NextResponse.json(
        { error: "Failed to delete tenant" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in tenant deletion API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
