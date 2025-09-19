"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/ui/stepper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { getAvailableProviders } from "@/lib/connectors/manifests"
import { type ProviderId, type ConnectorConfig } from "@/lib/connectors/types"
import { ProviderSelectionStep } from "./wizard/provider-selection-step"
import { ProviderConfigStep } from "./wizard/provider-config-step"
import { ReviewStep } from "./wizard/review-step"

interface AddConnectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
  onSuccess?: (connectorId: string) => void
}

const steps = ["プロバイダー選択", "設定", "確認", "接続"]

export function AddConnectorDialog({ 
  open, 
  onOpenChange, 
  tenantId,
  onSuccess 
}: AddConnectorDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | null>(null)
  const [providerConfig, setProviderConfig] = useState<Record<string, any>>({})
  const [clientCredentials, setClientCredentials] = useState({
    clientId: '',
    clientSecret: ''
  })
  const [selectedScopes, setSelectedScopes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const providers = getAvailableProviders()

  const handleClose = useCallback(() => {
    // Reset all state when closing
    setCurrentStep(1)
    setSelectedProvider(null)
    setProviderConfig({})
    setClientCredentials({ clientId: '', clientSecret: '' })
    setSelectedScopes([])
    setError(null)
    setIsLoading(false)
    onOpenChange(false)
  }, [onOpenChange])

  const handleNext = useCallback(() => {
    setError(null)
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const handleBack = useCallback(() => {
    setError(null)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleProviderSelect = useCallback((providerId: ProviderId) => {
    setSelectedProvider(providerId)
    const provider = providers.find(p => p.id === providerId)
    if (provider) {
      setSelectedScopes(provider.defaultScopes)
    }
  }, [providers])

  const handleCreateConnector = useCallback(async () => {
    if (!selectedProvider) {
      setError("プロバイダーが選択されていません")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const config: ConnectorConfig = {
        tenantId,
        provider: selectedProvider,
        providerConfig,
        clientId: clientCredentials.clientId,
        clientSecret: clientCredentials.clientSecret,
        scopes: selectedScopes
      }

      // Call server action to create connector
      const response = await fetch('/api/admin/connectors', {
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
      const startUrl = `/api/connect/${selectedProvider}/start-v2?tenantId=${tenantId}&connectorId=${connectorId}`
      window.location.href = startUrl

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [selectedProvider, tenantId, providerConfig, clientCredentials, selectedScopes])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedProvider !== null
      case 2:
        return (
          clientCredentials.clientId.trim() !== '' &&
          clientCredentials.clientSecret.trim() !== '' &&
          selectedScopes.length > 0
        )
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
          <ProviderSelectionStep
            providers={providers}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
          />
        )
      case 2:
        return selectedProvider ? (
          <ProviderConfigStep
            provider={providers.find(p => p.id === selectedProvider)!}
            config={providerConfig}
            onConfigChange={setProviderConfig}
            credentials={clientCredentials}
            onCredentialsChange={setClientCredentials}
            scopes={selectedScopes}
            onScopesChange={setSelectedScopes}
          />
        ) : null
      case 3:
        return selectedProvider ? (
          <ReviewStep
            provider={providers.find(p => p.id === selectedProvider)!}
            config={providerConfig}
            credentials={clientCredentials}
            scopes={selectedScopes}
            tenantId={tenantId}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-semibold pr-8">
            コネクター追加
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stepper */}
          <Stepper steps={steps} currentStep={currentStep} />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
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
                  onClick={handleCreateConnector}
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
