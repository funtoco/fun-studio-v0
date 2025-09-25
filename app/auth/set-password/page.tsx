"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [sessionEstablished, setSessionEstablished] = useState(false)
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if user is already logged in
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setIsAlreadyLoggedIn(true)
          return
        }

        // Parse hash from URL (for direct invitation links and errors)
        const hash = window.location.hash.substring(1)
        const hashParams = new URLSearchParams(hash)
        
        // Parse query parameters from URL (for Supabase verify links)
        const urlParams = new URLSearchParams(window.location.search)
        
        // Check for errors in hash parameters (from Supabase verify endpoint)
        const hashError = hashParams.get('error')
        const hashErrorCode = hashParams.get('error_code')
        const hashErrorDescription = hashParams.get('error_description')
        
        if (hashError) {
          console.log('Hash error detected:', {
            error: hashError,
            errorCode: hashErrorCode,
            errorDescription: hashErrorDescription
          })
          
          if (hashErrorCode === 'otp_expired') {
            setError("リンクの有効期限が切れています。招待メールを再送してください。")
          } else {
            setError("このリンクは無効です。もう一度お試しください。")
          }
          setInvalidLink(true)
          return
        }
        
        const type = hashParams.get('type') || urlParams.get('type')
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const token = urlParams.get('token')
        const error = urlParams.get('error')
        const verified = urlParams.get('verified')
        const userId = urlParams.get('user_id')

        console.log('URL parameters:', {
          error,
          verified,
          userId,
          search: window.location.search
        })

        // Handle errors from verify-invite route
        if (error) {
          if (error === 'expired') {
            setError("リンクの有効期限が切れています。招待メールを再送してください。")
          } else {
            setError("このリンクは無効です。もう一度お試しください。")
          }
          setInvalidLink(true)
          return
        }

        // If verified by verify-invite route, check if user is now logged in
        if (verified === 'true') {
          const { data: { user } } = await supabase.auth.getUser()
          console.log('User after verification:', {
            hasUser: !!user,
            userId: user?.id,
            expectedUserId: userId
          })
          
          if (user) {
            setSessionEstablished(true)
            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname)
            return
          } else {
            console.log('No user found after verification, setting invalid link')
            setInvalidLink(true)
            return
          }
        }

        console.log('Parsed parameters:', {
          type,
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          token: token ? 'present' : 'missing',
          hash: hash,
          search: window.location.search
        })

        // If we have a token from Supabase verify endpoint, handle it directly
        if (token && type === 'invite') {
          console.log('Detected Supabase invite token, verifying directly...')
          
          try {
            // Try to verify the invitation token
            let data, error
            
            try {
              // First try with token_hash
              const result = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'invite'
              })
              data = result.data
              error = result.error
            } catch (verifyError) {
              console.log('verifyOtp failed, trying alternative method:', verifyError)
              // If verifyOtp fails, try to use the token directly
              const result = await supabase.auth.verifyOtp({
                token: token,
                type: 'invite'
              })
              data = result.data
              error = result.error
            }
            
            console.log('Token verification attempt:', {
              token: token ? `${token.substring(0, 10)}...` : 'missing',
              tokenLength: token?.length,
              type: 'invite',
              fullToken: token // デバッグ用（本番では削除）
            })

            console.log('Direct OTP verification result:', {
              hasSession: !!data.session,
              hasUser: !!data.user,
              error: error?.message
            })

            if (error) {
              console.error('Direct invitation verification error:', error)
              setError("リンクの有効期限が切れています。招待メールを再送してください。")
              setInvalidLink(true)
              return
            }

            if (data.session && data.user) {
              console.log('User metadata:', data.user.user_metadata)
              setSessionEstablished(true)
              // Clear the URL parameters
              window.history.replaceState({}, document.title, window.location.pathname)
              return
            } else {
              console.log('No session established after direct verification')
              setInvalidLink(true)
              return
            }
          } catch (error) {
            console.error('Direct verification error:', error)
            setInvalidLink(true)
            return
          }
        }

        // Validate required parameters for direct hash links
        if (!type || !accessToken || !refreshToken) {
          setInvalidLink(true)
          return
        }

        establishSession(type, accessToken, refreshToken)
      } catch (error) {
        console.error('Initialization error:', error)
        setInvalidLink(true)
      }
    }

    const establishSession = async (type: string, accessToken: string, refreshToken: string) => {
      try {
        // Only allow signup, invite (invitation) or recovery types
        if (type !== 'signup' && type !== 'invite' && type !== 'recovery') {
          setInvalidLink(true)
          return
        }

        // Establish session
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('Session establishment error:', error)
          setInvalidLink(true)
          return
        }

        if (data.session) {
          setSessionEstablished(true)
          // Clear the hash from URL for security
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      } catch (error) {
        console.error('Session establishment error:', error)
        setInvalidLink(true)
      }
    }

    initializeSession()
  }, [supabase.auth])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "パスワードは8文字以上で入力してください"
    }
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
      return "パスワードは英字と数字を含む必要があります"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("パスワードが一致しません")
      setLoading(false)
      return
    }

    try {
      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        if (updateError.message.includes('refresh_token') || updateError.message.includes('expired')) {
          setError("リンクの有効期限が切れています。招待メールを再送してください。")
        } else {
          setError(updateError.message)
        }
        setLoading(false)
        return
      }

      // Update tenant member status
      try {
        const response = await fetch('/api/auth/activate-membership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.error('Failed to activate membership, but password was set successfully')
        }
      } catch (membershipError) {
        console.error('Error activating membership:', membershipError)
        // Don't block the user flow if membership activation fails
      }

      setSuccess(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.replace('/admin/tenants')
      }, 3000)

    } catch (error) {
      console.error('Password update error:', error)
      setError("パスワードの設定に失敗しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  // Already logged in
  if (isAlreadyLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>すでに設定済みです</CardTitle>
            <CardDescription>
              パスワードは既に設定されています。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/admin/tenants')} 
              className="w-full"
            >
              ホームへ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Invalid link
  if (invalidLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle>このリンクは無効です</CardTitle>
            <CardDescription>
              このリンクは無効です。もう一度お試しください。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
            >
              ログインページへ
            </Button>
            <div className="text-center">
              <Link 
                href="/auth/resend-invite" 
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                リンクが期限切れの場合はこちら（再送）
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <CardTitle>パスワードを設定しました</CardTitle>
            <CardDescription>
              画面を切り替えます…
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Show form only if session is established
  if (!sessionEstablished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <CardTitle>セッションを確立中...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>初回パスワード設定</CardTitle>
          <CardDescription>
            新しいパスワードを設定してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">新しいパスワード</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8文字以上、英字と数字を含む"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認用パスワード</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="パスワードを再入力"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "設定中..." : "パスワードを設定"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/resend-invite" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              リンクが期限切れの場合はこちら（再送）
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
