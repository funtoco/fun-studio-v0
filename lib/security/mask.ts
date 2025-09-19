/**
 * String masking utilities for UI display
 * Prevents sensitive data exposure in frontend
 */

/**
 * Mask a string showing only first/last characters
 */
export function maskString(
  value: string, 
  options: {
    showStart?: number
    showEnd?: number
    maskChar?: string
    minLength?: number
  } = {}
): string {
  const {
    showStart = 3,
    showEnd = 3,
    maskChar = '•',
    minLength = 8
  } = options
  
  if (!value || value.length < minLength) {
    return maskChar.repeat(minLength)
  }
  
  if (value.length <= showStart + showEnd) {
    return maskChar.repeat(value.length)
  }
  
  const start = value.slice(0, showStart)
  const end = value.slice(-showEnd)
  const middleLength = Math.max(3, value.length - showStart - showEnd)
  const middle = maskChar.repeat(middleLength)
  
  return `${start}${middle}${end}`
}

/**
 * Mask an OAuth client ID
 */
export function maskClientId(clientId: string): string {
  return maskString(clientId, {
    showStart: 4,
    showEnd: 4,
    maskChar: '•',
    minLength: 12
  })
}

/**
 * Mask an OAuth client secret
 */
export function maskClientSecret(clientSecret: string): string {
  return maskString(clientSecret, {
    showStart: 2,
    showEnd: 2,
    maskChar: '•',
    minLength: 16
  })
}

/**
 * Mask an access token
 */
export function maskAccessToken(token: string): string {
  return maskString(token, {
    showStart: 6,
    showEnd: 4,
    maskChar: '•',
    minLength: 20
  })
}

/**
 * Mask a subdomain
 */
export function maskSubdomain(subdomain: string): string {
  if (subdomain.length <= 4) {
    return subdomain // Don't mask short subdomains
  }
  
  return maskString(subdomain, {
    showStart: 2,
    showEnd: 2,
    maskChar: '•',
    minLength: 6
  })
}

/**
 * Mask email address
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  if (!domain) return maskString(email)
  
  const maskedUsername = maskString(username, {
    showStart: 1,
    showEnd: 1,
    maskChar: '•',
    minLength: 4
  })
  
  return `${maskedUsername}@${domain}`
}

/**
 * Get masking info for UI display
 */
export function getMaskingInfo(originalLength: number): string {
  return `${originalLength} characters (masked for security)`
}
