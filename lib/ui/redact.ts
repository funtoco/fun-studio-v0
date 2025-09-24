/**
 * Redact sensitive strings for display purposes
 * @param s - String to redact
 * @param vis - Number of visible characters at start and end
 * @returns Redacted string with middle characters replaced by dots
 */
export function redact(s: string, vis = 4): string {
  if (!s) return ""
  
  if (s.length <= vis * 2) {
    return s[0] + "•".repeat(Math.max(0, s.length - 2)) + s.at(-1)
  }
  
  return s.slice(0, vis) + "•".repeat(s.length - vis * 2) + s.slice(-vis)
}

/**
 * Redact client ID for display (show first 8 and last 4 characters)
 */
export function redactClientId(clientId: string): string {
  if (!clientId) return ""
  if (clientId.length <= 12) return redact(clientId, 2)
  return redact(clientId, 8)
}

/**
 * Redact domain for display (show subdomain and last part)
 */
export function redactDomain(domain: string): string {
  if (!domain) return ""
  
  try {
    const url = new URL(domain)
    const hostname = url.hostname
    
    if (hostname.includes('.')) {
      const parts = hostname.split('.')
      if (parts.length >= 2) {
        // Show first part (subdomain) and last part (domain)
        return `${parts[0]}••••${parts[parts.length - 1]}`
      }
    }
    
    return redact(hostname, 3)
  } catch {
    return redact(domain, 3)
  }
}
