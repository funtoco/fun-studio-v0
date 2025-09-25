import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { activateUserTenantMembership } from "@/lib/supabase/tenants"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await activateUserTenantMembership(user.id, user.email!)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to activate membership" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Membership activated successfully" 
    })
  } catch (error) {
    console.error("Error activating membership:", error)
    return NextResponse.json(
      { error: "Failed to activate membership" },
      { status: 500 }
    )
  }
}
