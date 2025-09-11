"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface KanbanItem {
  id: string
  title: string
  subtitle?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  metadata?: Record<string, any>
}

export interface KanbanColumn {
  id: string
  title: string
  items: KanbanItem[]
  color?: string
}

interface ReadonlyKanbanProps {
  columns: KanbanColumn[]
  onItemClick?: (item: KanbanItem) => void
  className?: string
}

export function ReadonlyKanban({ columns, onItemClick, className }: ReadonlyKanbanProps) {
  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Badge variant="secondary" className="ml-2">
              {column.items.length}
            </Badge>
          </div>

          {/* Column Items */}
          <div className="space-y-3">
            {column.items.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground text-sm">項目がありません</p>
                </CardContent>
              </Card>
            ) : (
              column.items.map((item) => (
                <Card
                  key={item.id}
                  className={cn("transition-colors", onItemClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onItemClick?.(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium leading-tight">{item.title}</CardTitle>
                      {item.badge && (
                        <Badge variant={item.badgeVariant || "default"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  {item.subtitle && (
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
