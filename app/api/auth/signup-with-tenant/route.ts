import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/client"
import { activateUserTenantMembership } from "@/lib/supabase/tenants"

export async function POST(request: NextRequest) {
  try {
    const { userId, tenantName, email } = await request.json()

    if (!userId || !tenantName || !email) {
      return NextResponse.json(
        { error: "User ID, tenant name, and email are required" },
        { status: 400 }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createAdminClient()

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

    // Create user_tenants record with owner role
    const { error: userTenantError } = await supabase
      .from('user_tenants')
      .insert({
        user_id: userId,
        tenant_id: tenant.id,
        email: email,
        role: 'owner',
        status: 'active'
      })

    if (userTenantError) {
      console.error('Error creating user_tenants record:', userTenantError)
      return NextResponse.json(
        { error: "Failed to create user_tenants record" },
        { status: 500 }
      )
    }

    // Update user metadata with tenant_id for RLS
    const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        tenant_id: tenant.id
      }
    })

    if (updateError) {
      console.error('Error updating user metadata:', updateError)
      // Don't fail the entire process if metadata update fails
    }

    // Activate any pending tenant memberships for this user
    try {
      await activateUserTenantMembership(userId, email)
    } catch (membershipError) {
      console.error('Error activating pending memberships:', membershipError)
      // Don't fail the entire process if membership activation fails
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
