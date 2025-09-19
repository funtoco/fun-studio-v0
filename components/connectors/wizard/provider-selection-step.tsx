"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { type ProviderManifest, type ProviderId } from "@/lib/connectors/types"
import { Cable, Check } from "lucide-react"

interface ProviderSelectionStepProps {
  providers: ProviderManifest[]
  selectedProvider: ProviderId | null
  onProviderSelect: (providerId: ProviderId) => void
}

export function ProviderSelectionStep({
  providers,
  selectedProvider,
  onProviderSelect
}: ProviderSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">プロバイダーを選択</h3>
        <p className="text-sm text-muted-foreground">
          連携したいサービスを選択してください
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((provider) => (
          <Card
            key={provider.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedProvider === provider.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            )}
            onClick={() => onProviderSelect(provider.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {provider.icon || <Cable className="h-6 w-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-base">{provider.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {provider.clientMode === 'per-tenant' ? 'BYOC' : 'Global'}
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
              
              <div className="mt-3 space-y-2">
                <div className="text-xs text-muted-foreground">
                  デフォルトスコープ:
                </div>
                <div className="flex flex-wrap gap-1">
                  {provider.defaultScopes.slice(0, 3).map((scope) => (
                    <Badge key={scope} variant="secondary" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                  {provider.defaultScopes.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider.defaultScopes.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          利用可能なプロバイダーがありません
        </div>
      )}
    </div>
  )
}
