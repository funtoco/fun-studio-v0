"use client"

import { useRouter } from 'next/navigation'
import { SyncAppsButton } from './sync-apps-button'

interface SyncAppsButtonWrapperProps {
  connectorId: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function SyncAppsButtonWrapper({ 
  connectorId, 
  variant = "default",
  size = "default",
  showLabel = true 
}: SyncAppsButtonWrapperProps) {
  const router = useRouter()

  const handleSuccess = () => {
    // Refresh the page to show updated data
    router.refresh()
  }

  return (
    <SyncAppsButton
      connectorId={connectorId}
      onSuccess={handleSuccess}
      variant={variant}
      size={size}
      showLabel={showLabel}
    />
  )
}
