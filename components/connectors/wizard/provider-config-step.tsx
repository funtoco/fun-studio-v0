"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Info, X } from "lucide-react"
import { type ProviderManifest } from "@/lib/connectors/types"
import { cn } from "@/lib/utils"

interface ProviderConfigStepProps {
  provider: ProviderManifest
  config: Record<string, any>
  onConfigChange: (config: Record<string, any>) => void
  credentials: { clientId: string; clientSecret: string }
  onCredentialsChange: (credentials: { clientId: string; clientSecret: string }) => void
  scopes: string[]
  onScopesChange: (scopes: string[]) => void
}

export function ProviderConfigStep({
  provider,
  config,
  onConfigChange,
  credentials,
  onCredentialsChange,
  scopes,
  onScopesChange
}: ProviderConfigStepProps) {
  const [showSecret, setShowSecret] = useState(false)
  const [customScope, setCustomScope] = useState("")

  const handleConfigFieldChange = (key: string, value: any) => {
    onConfigChange({
      ...config,
      [key]: value
    })
  }

  const handleCredentialChange = (field: 'clientId' | 'clientSecret', value: string) => {
    onCredentialsChange({
      ...credentials,
      [field]: value
    })
  }

  const addCustomScope = () => {
    if (customScope.trim() && !scopes.includes(customScope.trim())) {
      onScopesChange([...scopes, customScope.trim()])
      setCustomScope("")
    }
  }

  const removeScope = (scope: string) => {
    onScopesChange(scopes.filter(s => s !== scope))
  }

  const isDefaultScope = (scope: string) => {
    return provider.defaultScopes.includes(scope)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">
          {provider.title} の設定
        </h3>
        <p className="text-sm text-muted-foreground">
          OAuth クライアントの認証情報を入力してください
        </p>
      </div>

      {/* Provider-specific configuration */}
      {provider.configFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">プロバイダー設定</CardTitle>
            <CardDescription>
              {provider.title} 固有の設定項目
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {provider.configFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    id={field.key}
                    type="text"
                    placeholder={field.placeholder}
                    value={config[field.key] || ''}
                    onChange={(e) => handleConfigFieldChange(field.key, e.target.value)}
                    required={field.required}
                    className={cn(
                      field.validation?.pattern && config[field.key] && 
                      !new RegExp(field.validation.pattern).test(config[field.key]) &&
                      "border-destructive focus:border-destructive"
                    )}
                  />
                )}
                
                {field.description && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* OAuth Client Credentials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">OAuth クライアント認証情報</CardTitle>
          <CardDescription>
            {provider.title} で作成した OAuth アプリの認証情報
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId" className="text-sm font-medium">
              Client ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientId"
              type="text"
              placeholder="your-client-id"
              value={credentials.clientId}
              onChange={(e) => handleCredentialChange('clientId', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret" className="text-sm font-medium">
              Client Secret <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="clientSecret"
                type={showSecret ? "text" : "password"}
                placeholder="your-client-secret"
                value={credentials.clientSecret}
                onChange={(e) => handleCredentialChange('clientSecret', e.target.value)}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              認証情報は暗号化されて安全に保存されます。フロントエンドには送信されません。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Scopes Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">アクセススコープ</CardTitle>
          <CardDescription>
            アプリがアクセスする権限を選択してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {scopes.map((scope) => (
                <Badge
                  key={scope}
                  variant={isDefaultScope(scope) ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {scope}
                  {!isDefaultScope(scope) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => removeScope(scope)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="カスタムスコープを追加"
                value={customScope}
                onChange={(e) => setCustomScope(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addCustomScope()
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addCustomScope}
                disabled={!customScope.trim() || scopes.includes(customScope.trim())}
              >
                追加
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              デフォルトスコープは削除できません。カスタムスコープを追加できます。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
