import { ConnectorShell } from "@/components/layout/connector-shell"

export default function AdminConnectorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConnectorShell>{children}</ConnectorShell>
}
