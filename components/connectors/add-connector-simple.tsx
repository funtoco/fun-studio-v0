"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Cable, Check, Eye, EyeOff, Info } from "lucide-react"
import Image from "next/image"

interface AddConnectorSimpleProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const providers = [
  {
    id: 'kintone',
    name: 'Kintone',
    description: 'Kintone アプリとの連携でデータ同期を自動化',
    icon: '/kintone-logo-horizontal.webp',
    defaultScopes: ['k:app_record:read', 'k:app_settings:read']
  },
  {
    id: 'hubspot',
    name: 'HubSpot', 
    description: 'HubSpot CRM との連携（近日公開予定）',
    icon: '/imgbin-logo-hubspot-inc.jpg',
    defaultScopes: ['crm.objects.contacts.read']
  }
]

export function AddConnectorSimple({ open, onOpenChange, onSuccess }: AddConnectorSimpleProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [subdomain, setSubdomain] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setCurrentStep(1)
    setSelectedProvider(null)
    setSubdomain('')
    setClientId('')
    setClientSecret('')
    setShowSecret(false)
    setError(null)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleNext = () => {
    setError(null)
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Create connector via API
      const providerData = providers.find(p => p.id === selectedProvider)
      const config = {
        name: `${providerData?.name} (${selectedProvider === 'kintone' ? subdomain : 'Main'})`,
        tenantId: "550e8400-e29b-41d4-a716-446655440001", // Funtoco
        provider: selectedProvider,
        providerConfig: selectedProvider === 'kintone' ? { subdomain } : {},
        clientId,
        clientSecret,
        scopes: providerData?.defaultScopes || []
      }

      // Use test endpoint for Mock OAuth development
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/admin/connectors/test' 
        : '/api/admin/connectors'
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create connector')
      }

      const { connectorId } = await response.json()

      // Start OAuth flow with new v2 endpoint
      const returnTo = encodeURIComponent(`/admin/connectors/${connectorId}?tenantId=${config.tenantId}&connected=true`)
      const startUrl = `/api/connect/${selectedProvider}/start-v2?tenantId=${config.tenantId}&connectorId=${connectorId}&returnTo=${returnTo}`
      
      // Show success message first
      alert('コネクターが作成されました！OAuth認証を開始します...')
      
      // Redirect to OAuth
      window.location.href = startUrl

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedProvider !== null
      case 2:
        return subdomain.trim() !== '' && clientId.trim() !== '' && clientSecret.trim() !== ''
      case 3:
        return true
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">プロバイダーを選択</h3>
              <p className="text-sm text-muted-foreground">
                連携したいサービスを選択してください
              </p>
            </div>

            <div className="grid gap-4">
              {providers.map((provider) => (
                <Card
                  key={provider.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedProvider === provider.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 relative">
                          <Image
                            src={provider.icon}
                            alt={`${provider.name} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">{provider.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {provider.id === 'kintone' ? 'BYOC' : 'Global'}
                          </Badge>
                        </div>
                      </div>
                      
                      {selectedProvider === provider.id && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      {provider.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {providers.find(p => p.id === selectedProvider)?.name} の設定
              </h3>
              <p className="text-sm text-muted-foreground">
                OAuth クライアントの認証情報を入力してください
              </p>
            </div>

            {selectedProvider === 'kintone' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kintone 設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">
                      サブドメイン <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subdomain"
                      placeholder="example"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground flex items-start gap-1">
                      <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      Your Kintone subdomain (from https://subdomain.cybozu.com)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">OAuth クライアント認証情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">
                    Client ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="clientId"
                    placeholder="your-client-id"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientSecret">
                    Client Secret <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="clientSecret"
                      type={showSecret ? "text" : "password"}
                      placeholder="your-client-secret"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
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
                    認証情報は暗号化されて安全に保存されます。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">設定内容の確認</h3>
              <p className="text-sm text-muted-foreground">
                以下の内容でコネクターを作成します
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 relative">
                    <Image
                      src={providers.find(p => p.id === selectedProvider)?.icon || ''}
                      alt={`${providers.find(p => p.id === selectedProvider)?.name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {providers.find(p => p.id === selectedProvider)?.name} コネクター
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedProvider === 'kintone' && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">サブドメイン:</span>
                    <span className="text-sm font-medium">{subdomain}.cybozu.com</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client ID:</span>
                  <span className="text-sm font-mono">{clientId.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client Secret:</span>
                  <span className="text-sm font-mono">••••••••</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            コネクター追加
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                    step === currentStep
                      ? "border-primary bg-background text-primary"
                      : step < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 border-t-2 ${
                      step < currentStep ? "border-primary" : "border-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isLoading}
            >
              戻る
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isLoading}
                >
                  次へ
                </Button>
              ) : (
                <Button
                  onClick={handleCreate}
                  disabled={!canProceed() || isLoading}
                  className="bg-primary text-primary-foreground"
                >
                  {isLoading ? "作成中..." : "作成して接続"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
