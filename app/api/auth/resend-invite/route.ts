import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/client"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      )
    }

    // Use admin client to resend invitation
    const adminSupabase = createAdminClient()
    
    try {
      // Resend invitation email
      const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/set-password`
      })
      
      if (error) {
        console.error('Error resending invitation:', error)
        return NextResponse.json(
          { error: error.message || "招待の再送に失敗しました" },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "招待を再送しました" 
      })
    } catch (error) {
      console.error('Error in resend invitation process:', error)
      return NextResponse.json(
        { error: "招待の再送に失敗しました" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in resend invitation API:", error)
    return NextResponse.json(
      { error: "内部サーバーエラー" },
      { status: 500 }
    )
  }
}
