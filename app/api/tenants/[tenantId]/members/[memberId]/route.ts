import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updateUserTenantRole, removeUserFromTenant } from "@/lib/supabase/tenants"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string; memberId: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role } = body

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      )
    }

    await updateUserTenantRole(params.memberId, role)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating member role:", error)
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { tenantId: string; memberId: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await removeUserFromTenant(params.memberId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    )
  }
}
