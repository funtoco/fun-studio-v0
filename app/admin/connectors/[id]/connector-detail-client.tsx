"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Shield } from "lucide-react"
import { ConnectorAppMappingTab } from "./connector-app-mapping-tab"
import { type Connector } from "@/lib/types/connector"

interface ConnectorDetailClientProps {
  connector: Connector
  tenantId?: string
  connectionStatus?: { status: string } | null
  tab?: string
  children: React.ReactNode // Overview tab content
}

export function ConnectorDetailClient({ 
  connector, 
  tenantId, 
  connectionStatus, 
  tab,
  children 
}: ConnectorDetailClientProps) {
  const [appMappingsCount, setAppMappingsCount] = useState(0)

  const handleMappingsCountChange = (count: number) => {
    setAppMappingsCount(count)
  }

  return (
    <Tabs defaultValue={tab === 'app-mapping' ? 'app-mapping' : 'overview'} className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="overview" className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>概要</span>
        </TabsTrigger>
        <TabsTrigger value="app-mapping" className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span>アプリ＆マッピング</span>
          <Badge variant="outline">{appMappingsCount}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        {children}
      </TabsContent>

      <TabsContent value="app-mapping" className="space-y-6">
        <ConnectorAppMappingTab
          connector={connector}
          tenantId={tenantId || ''}
          connectionStatus={connectionStatus}
          onMappingsCountChange={handleMappingsCountChange}
        />
      </TabsContent>
    </Tabs>
  )
}
