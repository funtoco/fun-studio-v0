import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // クエリパラメータから取得
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const excludeTenantId = searchParams.get('excludeTenantId')

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      )
    }

    // 現在のユーザーが所属しているテナントを取得
    const { data: userTenants, error: userTenantsError } = await supabase
      .from('user_tenants')
      .select('tenant_id')
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (userTenantsError) {
      console.error('Error fetching user tenants:', userTenantsError)
      return NextResponse.json(
        { error: "Failed to fetch user tenants" },
        { status: 500 }
      )
    }

    if (!userTenants || userTenants.length === 0) {
      return NextResponse.json({ users: [] })
    }

    const tenantIds = userTenants.map(ut => ut.tenant_id)

    // 所属テナントのメンバーを検索
    // メールアドレスに部分一致する既存ユーザーを検索する必要がある
    // auth.usersテーブルは直接検索できないため、user_tenantsテーブルから検索
    
    // まず、emailでユーザーを検索（auth.usersは検索できないので、user_tenantsのemailカラムから検索）
    const { data: matchingUserTenants, error: searchError } = await supabase
      .from('user_tenants')
      .select(`
        user_id,
        email,
        tenant_id,
        role,
        status
      `)
      .ilike('email', `%${email}%`)
      .in('tenant_id', tenantIds)

    if (searchError) {
      console.error('Error searching users:', searchError)
      return NextResponse.json(
        { error: "Failed to search users" },
        { status: 500 }
      )
    }

    // 除外するテナントIDが指定されている場合はフィルタ
    let filteredResults = matchingUserTenants || []
    
    if (excludeTenantId) {
      filteredResults = filteredResults.filter(
        ut => ut.tenant_id !== excludeTenantId
      )
    }

    // 重複を排除（同じuser_idで複数のテナントに所属している場合）
    const uniqueUsers = new Map<string, any>()
    
    for (const ut of filteredResults) {
      if (!uniqueUsers.has(ut.user_id)) {
        uniqueUsers.set(ut.user_id, {
          user_id: ut.user_id,
          email: ut.email,
          // 最初にヒットしたテナントのロールを使用
          role: ut.role,
          status: ut.status
        })
      }
    }

    // auth.usersから追加情報を取得
    const userIds = Array.from(uniqueUsers.keys())
    if (userIds.length === 0) {
      return NextResponse.json({ users: [] })
    }

    // Supabase Admin APIを使用してユーザー情報を取得
    const adminSupabase = await import('@/lib/supabase/client').then(m => m.createAdminClient())
    
    const users = []
    for (const userId of userIds) {
      const { data: authUser, error: authError } = await adminSupabase.auth.admin.getUserById(userId)
      
      if (!authError && authUser?.user) {
        const userTenantInfo = uniqueUsers.get(userId)
        users.push({
          user_id: userId,
          email: authUser.user.email,
          name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0],
          role: userTenantInfo?.role || 'member',
          status: userTenantInfo?.status || 'active'
        })
      }
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error in user search:", error)
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    )
  }
}

