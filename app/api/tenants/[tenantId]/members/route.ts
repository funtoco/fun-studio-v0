import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/client"
import { getTenantMembers } from "@/lib/supabase/tenants"

export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const members = await getTenantMembers(params.tenantId)
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching tenant members:", error)
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    )
  }
}

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
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}/auth/set-password`
      })
      
      console.log('Invitation result:', {
        email,
        tenantId: params.tenantId,
        role,
        hasData: !!data,
        hasError: !!error,
        errorMessage: error?.message,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'}/auth/set-password`
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
          user_id: null, // Will be null until user accepts
          tenant_id: params.tenantId,
          email: email,
          role: role,
          status: 'pending',
          invited_by: user.id,
          invited_at: new Date().toISOString()
        })
      
      if (userTenantError) {
        console.error('Error creating user tenant record:', userTenantError)
        // Don't fail here as the invitation email was sent successfully
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
