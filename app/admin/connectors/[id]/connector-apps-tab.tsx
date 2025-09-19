/**
 * Apps tab component for connector detail page
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { Database, Settings, ExternalLink } from "lucide-react"
import Link from "next/link"
import { kintoneApps } from "@/data/kintone-apps"
import { appMappings } from "@/data/mappings-apps"
import { type Connector } from "@/lib/db/connectors"

interface ConnectorAppsTabProps {
  connector: Connector
  tenantId: string
}

export function ConnectorAppsTab({ connector, tenantId }: ConnectorAppsTabProps) {
  // Filter apps by connector
  const filteredApps = kintoneApps.filter(app => 
    app.connectorId === connector.id || 
    app.subdomain === connector.provider_config.subdomain
  )
  
  const getAppMappingStatus = (appCode: string) => {
    const mapping = appMappings.find(m => 
      m.appCode === appCode && 
      (m.connectorId === connector.id || m.subdomain === connector.provider_config.subdomain)
    )
    return mapping?.status || 'unmapped'
  }
  
  const getMappingBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">アクティブ</Badge>
      case 'inactive':
        return <Badge variant="secondary">非アクティブ</Badge>
      case 'error':
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">未マッピング</Badge>
    }
  }

  if (connector.provider !== 'kintone') {
    return (
      <EmptyState
        icon={<Database className="h-12 w-12" />}
        title="Kintone プロバイダーではありません"
        description={`このコネクターは ${connector.provider} プロバイダーです`}
      />
    )
  }

  if (filteredApps.length === 0) {
    return (
      <EmptyState
        icon={<Database className="h-12 w-12" />}
        title="まだアプリがありません"
        description="このコネクターに関連付けられた Kintone アプリがありません"
        action={
          <Button disabled>
            <Database className="h-4 w-4 mr-2" />
            アプリを同期（準備中）
          </Button>
        }
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Kintone アプリ一覧</span>
          <Badge variant="outline">{filteredApps.length} 件</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>アプリ名</TableHead>
              <TableHead>アプリコード</TableHead>
              <TableHead>フィールド数</TableHead>
              <TableHead>マッピング状態</TableHead>
              <TableHead>更新日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.map((app) => {
              const mappingStatus = getAppMappingStatus(app.appCode)
              return (
                <TableRow key={app.appCode}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {app.appCode}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.fieldCount}</Badge>
                  </TableCell>
                  <TableCell>
                    {getMappingBadge(mappingStatus)}
                  </TableCell>
                  <TableCell>
                    {new Date(app.updatedAt).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
