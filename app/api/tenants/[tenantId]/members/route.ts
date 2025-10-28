import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
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
