import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { acceptTenantInvitation } from "@/lib/supabase/tenants"

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await acceptTenantInvitation(params.token)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      tenant_id: result.tenant_id 
    })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    )
  }
}
