/**
 * Mappings tab component for connector detail page
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { Database, GitBranch, Settings, ExternalLink } from "lucide-react"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { type Connector } from "@/lib/db/connectors"

interface ConnectorMappingsTabProps {
  connector: Connector
  tenantId: string
}

export function ConnectorMappingsTab({ connector, tenantId }: ConnectorMappingsTabProps) {
  // Filter mappings by connector
  const filteredAppMappings = appMappings.filter(mapping => 
    mapping.connectorId === connector.id ||
    mapping.subdomain === 'funtoco' // Hardcoded for now since we don't have provider_config in new system
  )
  
  const filteredFieldMappings = fieldMappings.filter(mapping => 
    mapping.connectorId === connector.id ||
    filteredAppMappings.some(app => app.appCode === mapping.appCode)
  )
  
  const getMappingStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">アクティブ</Badge>
      case 'inactive':
        return <Badge variant="secondary">非アクティブ</Badge>
      case 'error':
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">未設定</Badge>
    }
  }

  return (
    <Tabs defaultValue="apps" className="space-y-6">
      <TabsList>
        <TabsTrigger value="apps" className="flex items-center space-x-2">
          <Database className="h-4 w-4" />
          <span>アプリマッピング</span>
          <Badge variant="outline">{filteredAppMappings.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="fields" className="flex items-center space-x-2">
          <GitBranch className="h-4 w-4" />
          <span>フィールドマッピング</span>
          <Badge variant="outline">{filteredFieldMappings.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="apps" className="space-y-4">
        {filteredAppMappings.length === 0 ? (
          <EmptyState
            icon={<Database className="h-12 w-12" />}
            title="アプリマッピングがありません"
            description="このコネクターに関連付けられたアプリマッピングがありません"
            action={
              <Button disabled>
                <Database className="h-4 w-4 mr-2" />
                マッピング作成（準備中）
              </Button>
            }
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>アプリマッピング一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>アプリ名</TableHead>
                    <TableHead>アプリコード</TableHead>
                    <TableHead>サービス機能</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>更新日</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.appName}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {mapping.appCode}
                        </code>
                      </TableCell>
                      <TableCell>{mapping.serviceFunction}</TableCell>
                      <TableCell>
                        {getMappingStatusBadge(mapping.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(mapping.updatedAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="fields" className="space-y-4">
        {filteredFieldMappings.length === 0 ? (
          <EmptyState
            icon={<GitBranch className="h-12 w-12" />}
            title="フィールドマッピングがありません"
            description="このコネクターに関連付けられたフィールドマッピングがありません"
            action={
              <Button disabled>
                <GitBranch className="h-4 w-4 mr-2" />
                マッピング作成（準備中）
              </Button>
            }
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>フィールドマッピング一覧</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kintone フィールド</TableHead>
                    <TableHead>サービスフィールド</TableHead>
                    <TableHead>変換タイプ</TableHead>
                    <TableHead>ステータス</TableHead>
                    <TableHead>更新日</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFieldMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.kintoneField}</TableCell>
                      <TableCell>{mapping.serviceField}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.transformType}</Badge>
                      </TableCell>
                      <TableCell>
                        {getMappingStatusBadge(mapping.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(mapping.updatedAt).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
