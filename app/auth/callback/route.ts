import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectType = type || "recovery"
      return NextResponse.redirect(`${origin}/auth/set-password?type=${redirectType}`)
    }
    console.error("Code exchange error:", error)
  }

  return NextResponse.redirect(`${origin}/auth/set-password?error=invalid`)
}
