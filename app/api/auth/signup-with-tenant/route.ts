import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantName } = await request.json()

    if (!userId || !tenantName) {
      return NextResponse.json(
        { error: "User ID and tenant name are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generate slug from tenant name
    const slug = tenantName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: tenantName,
        slug: slug,
        description: `${tenantName}のテナント`,
        max_members: 50
      })
      .select()
      .single()

    if (tenantError) {
      console.error('Error creating tenant:', tenantError)
      return NextResponse.json(
        { error: "Failed to create tenant" },
        { status: 500 }
      )
    }

    // Update user metadata with tenant info
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        tenant_name: tenantName,
        tenant_id: tenant.id,
        role: 'owner'
      }
    })

    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      return NextResponse.json(
        { error: "Failed to update user metadata" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      tenant: tenant 
    })

  } catch (error) {
    console.error('Signup with tenant error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
