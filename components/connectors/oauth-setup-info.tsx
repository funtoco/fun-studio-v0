"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Info, CheckCircle } from "lucide-react"

interface OAuthSetupInfoProps {
  provider: string
  subdomain?: string
}

export function OAuthSetupInfo({ provider, subdomain }: OAuthSetupInfoProps) {
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Get current URL for redirect URI
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin)
    }
  }, [])

  const redirectUri = `${currentUrl}/api/connect/${provider}/callback-v2`
  const setupUrl = provider === 'kintone' && subdomain 
    ? `https://${subdomain}.cybozu.com/k/admin/system/oauth/`
    : '#'

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const requiredScopes = provider === 'kintone' 
    ? ['k:app_record:read', 'k:app_settings:read', 'k:app_record:write']
    : ['crm.objects.contacts.read', 'crm.objects.companies.read']

  return (
    <div className="space-y-4">
      {/* Current Redirect URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>OAuth 設定情報</span>
          </CardTitle>
          <CardDescription>
            {provider.charAt(0).toUpperCase() + provider.slice(1)} でのOAuth設定に必要な情報
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Redirect URI (コールバック URL)</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 bg-muted rounded font-mono text-sm break-all">
                {redirectUri}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(redirectUri)}
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              この URL を {provider.charAt(0).toUpperCase() + provider.slice(1)} の OAuth 設定に追加してください
            </p>
          </div>

          {/* Required Scopes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">必要なスコープ</label>
            <div className="flex flex-wrap gap-2">
              {requiredScopes.map((scope) => (
                <Badge key={scope} variant="outline" className="font-mono text-xs">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>

          {/* Setup Link */}
          {provider === 'kintone' && subdomain && (
            <div className="pt-2">
              <a 
                href={setupUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{subdomain}.cybozu.com の OAuth 設定を開く</span>
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="space-y-2">
          <div className="font-medium">OAuth クライアント設定手順:</div>
          <ol className="text-sm space-y-1 ml-4 list-decimal">
            <li>{provider.charAt(0).toUpperCase() + provider.slice(1)} の管理画面にログイン</li>
            <li>OAuth / API 設定ページに移動</li>
            <li>新しい OAuth クライアントを作成</li>
            <li>上記の Redirect URI をコピーして設定</li>
            <li>必要なスコープを選択</li>
            <li>Client ID と Client Secret を取得</li>
            <li>このアプリの設定に入力</li>
          </ol>
        </AlertDescription>
      </Alert>

      {/* Development Info */}
      {process.env.NODE_ENV === 'development' && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="space-y-1">
              <div className="font-medium">開発環境での注意:</div>
              <div className="text-sm">
                • 現在は localhost URL を使用しています<br/>
                • 本番環境では HTTPS の実際のドメインを使用してください<br/>
                • MOCK_OAUTH=1 でテスト可能です
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
