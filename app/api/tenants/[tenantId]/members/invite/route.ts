import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/client"

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Check if user has permission to invite
    const { data: userTenant } = await supabase
      .from('user_tenants')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', params.tenantId)
      .eq('status', 'active')
      .single()

    if (!userTenant || !['owner', 'admin'].includes(userTenant.role)) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 }
      )
    }

    // Check if email is already a member
    const { data: existingMember } = await supabase
      .from('user_tenants')
      .select('id, status')
      .eq('tenant_id', params.tenantId)
      .eq('email', email)
      .single()

    if (existingMember) {
      if (existingMember.status === 'pending') {
        return NextResponse.json(
          { error: "Invitation already sent (pending)" },
          { status: 400 }
        )
      } else if (existingMember.status === 'active') {
        return NextResponse.json(
          { error: "This user is already a member" },
          { status: 400 }
        )
      }
    }

    // Use admin client to send invitation
    const adminSupabase = createAdminClient()
    
    try {
      // Use Supabase auth admin to send invitation email
      const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
        data: {
          tenant_id: params.tenantId,
          role: role,
          invited_by: user.id
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/set-password`
      })
      
      if (error) {
        console.error('Error sending invitation:', error)
        return NextResponse.json(
          { error: error.message || "Failed to send invitation" },
          { status: 500 }
        )
      }
      
      // Store the invitation metadata in user_tenants with pending status
      const { error: userTenantError } = await supabase
        .from('user_tenants')
        .insert({
          user_id: data.user.id,
          tenant_id: params.tenantId,
          email: email,
          role: role,
          status: 'pending',
          invited_by: user.id,
          invited_at: new Date().toISOString()
        })
      
      if (userTenantError) {
        console.error('Error creating user tenant record:', userTenantError)
        // Check if it's a duplicate key error
        if (userTenantError.code === '23505') {
          return NextResponse.json(
            { error: "This user is already a member or has a pending invitation" },
            { status: 400 }
          )
        }
        return NextResponse.json(
          { error: "Failed to create user tenant record" },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Invitation sent successfully" 
      })
    } catch (error) {
      console.error('Error in invitation process:', error)
      return NextResponse.json(
        { error: "Failed to send invitation" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    )
  }
}

