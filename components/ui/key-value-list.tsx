import type { ReactNode } from "react"

interface KeyValueItem {
  key: string
  value: ReactNode
}

interface KeyValueListProps {
  items: KeyValueItem[]
  className?: string
}

export function KeyValueList({ items, className }: KeyValueListProps) {
  return (
    <dl className={className}>
      {items.map((item, index) => (
        <div key={index} className="py-2 flex justify-between">
          <dt className="text-sm font-medium text-muted-foreground">{item.key}</dt>
          <dd className="text-sm text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
