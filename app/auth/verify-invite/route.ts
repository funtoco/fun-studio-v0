import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const type = searchParams.get('type')
    const redirectTo = searchParams.get('redirect_to')

    console.log('Verify invite route called with:', {
      token: token ? 'present' : 'missing',
      type,
      redirectTo
    })

    if (!token || type !== 'invite') {
      console.log('Missing token or invalid type')
      return NextResponse.redirect(new URL('/auth/set-password?error=invalid', request.url))
    }

    const supabase = await createClient()
    
    // Verify the invitation token using verifyOtp
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'invite'
    })

    console.log('OTP verification result:', {
      hasSession: !!data.session,
      hasUser: !!data.user,
      error: error?.message
    })

    if (error) {
      console.error('Invitation verification error:', error)
      return NextResponse.redirect(new URL('/auth/set-password?error=expired', request.url))
    }

    if (data.session && data.user) {
      // Session established successfully, redirect to set-password page
      const redirectUrl = new URL('/auth/set-password', request.url)
      redirectUrl.searchParams.set('verified', 'true')
      redirectUrl.searchParams.set('user_id', data.user.id)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('No session established after verification')
    return NextResponse.redirect(new URL('/auth/set-password?error=invalid', request.url))
  } catch (error) {
    console.error('Verify invite error:', error)
    return NextResponse.redirect(new URL('/auth/set-password?error=invalid', request.url))
  }
}
