"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function InviteAcceptancePage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'not_logged_in'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setStatus('not_logged_in')
        setMessage('招待を受け入れるにはログインが必要です')
        return
      }

      acceptInvitation()
    }
  }, [user, authLoading])

  const acceptInvitation = async () => {
    try {
      const response = await fetch(`/api/invite/${params.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage('招待を受け入れました！テナントに参加しました。')
      } else {
        setStatus('error')
        setMessage(data.error || '招待の受け入れに失敗しました')
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      setStatus('error')
      setMessage('招待の受け入れ中にエラーが発生しました')
    }
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  if (authLoading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-center text-muted-foreground">
                招待を処理中...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <UserPlus className="h-6 w-6" />
            テナント招待
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'not_logged_in' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-orange-500 mx-auto" />
              <p className="text-muted-foreground">{message}</p>
              <Button onClick={handleLogin} className="w-full">
                ログイン
              </Button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-muted-foreground">{message}</p>
              <Badge variant="outline" className="text-green-600 border-green-200">
                参加完了
              </Badge>
              <Button onClick={handleGoToDashboard} className="w-full">
                ダッシュボードへ
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-muted-foreground">{message}</p>
              <Badge variant="outline" className="text-red-600 border-red-200">
                エラー
              </Badge>
              <Button onClick={handleGoToDashboard} variant="outline" className="w-full">
                ダッシュボードへ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
