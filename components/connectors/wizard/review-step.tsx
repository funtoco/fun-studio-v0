"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type ProviderManifest } from "@/lib/connectors/types"
import { maskClientId, maskClientSecret } from "@/lib/security/mask"
import { Shield, Key, Settings, Zap } from "lucide-react"

interface ReviewStepProps {
  provider: ProviderManifest
  config: Record<string, any>
  credentials: { clientId: string; clientSecret: string }
  scopes: string[]
  tenantId: string
}

export function ReviewStep({
  provider,
  config,
  credentials,
  scopes,
  tenantId
}: ReviewStepProps) {
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/connect/${provider.id}/callback`
    : `https://yourdomain.com/api/connect/${provider.id}/callback`

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">設定内容の確認</h3>
        <p className="text-sm text-muted-foreground">
          以下の内容でコネクターを作成します
        </p>
      </div>

      {/* Provider Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="text-lg">{provider.icon}</div>
            {provider.title} コネクター
          </CardTitle>
          <CardDescription>
            {provider.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">プロバイダー:</span>
              <div className="font-medium">{provider.title}</div>
            </div>
            <div>
              <span className="text-muted-foreground">クライアントモード:</span>
              <div className="font-medium">
                <Badge variant="outline">
                  {provider.clientMode === 'per-tenant' ? 'BYOC' : 'Global'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Provider Configuration */}
      {Object.keys(config).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              プロバイダー設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(config).map(([key, value]) => {
              const field = provider.configFields.find(f => f.key === key)
              return (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {field?.label || key}:
                  </span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* OAuth Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            OAuth 設定
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Client ID:</span>
              <span className="text-sm font-mono">
                {maskClientId(credentials.clientId)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Client Secret:</span>
              <span className="text-sm font-mono">
                {maskClientSecret(credentials.clientSecret)}
              </span>
            </div>

            <Separator />

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Redirect URI:</span>
              <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                {redirectUri}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Authorization URL:</span>
              <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                {provider.authorizeUrl(config)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scopes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4" />
            アクセススコープ
          </CardTitle>
          <CardDescription>
            {scopes.length} 個のスコープが設定されています
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => {
              const isDefault = provider.defaultScopes.includes(scope)
              return (
                <Badge
                  key={scope}
                  variant={isDefault ? "default" : "secondary"}
                  className="text-xs"
                >
                  {scope}
                  {!isDefault && (
                    <span className="ml-1 text-xs opacity-60">(カスタム)</span>
                  )}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            次のステップ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>コネクターがデータベースに作成されます</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>{provider.title} の認証ページにリダイレクトされます</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>認証後、自動的にコネクター設定ページに戻ります</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
