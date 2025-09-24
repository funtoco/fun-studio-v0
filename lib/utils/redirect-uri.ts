/**
 * Dynamic redirect URI computation
 */

export function computeBaseUrl(req: Request): string {
  // Check for forwarded headers first (production)
  const proto = req.headers.get("x-forwarded-proto") ?? "https"
  const host = req.headers.get("x-forwarded-host") ?? process.env.NEXT_PUBLIC_BASE_URL?.replace(/^https?:\/\//, "")
  
  if (host) {
    return `${proto}://${host}`
  }
  
  // Fallback to dev HTTPS URL when running npm run dev:https
  if (process.env.NODE_ENV === 'development') {
    return 'https://localhost:3000'
  }
  
  throw new Error("Base URL unavailable; set NEXT_PUBLIC_BASE_URL in dev")
}

export function computeRedirectUri(req: Request, path: string = '/api/auth/connectors/kintone/callback'): string {
  const baseUrl = computeBaseUrl(req)
  return `${baseUrl}${path}`
}
