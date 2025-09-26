import { redirect } from "next/navigation"

interface ConnectorsPageProps {
  searchParams: {
    tenantId?: string
    q?: string
  }
}

export default function ConnectorsPage({ searchParams }: ConnectorsPageProps) {
  // Redirect to dashboard with search params
  const params = new URLSearchParams()
  if (searchParams.tenantId) params.set('tenantId', searchParams.tenantId)
  if (searchParams.q) params.set('q', searchParams.q)
  
  const queryString = params.toString()
  const redirectUrl = `/admin/connectors/dashboard${queryString ? `?${queryString}` : ''}`
  
  redirect(redirectUrl)
}