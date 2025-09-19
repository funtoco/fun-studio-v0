/**
 * JWT state management for OAuth flows
 * Prevents CSRF attacks and maintains flow context
 */

import { SignJWT, jwtVerify } from 'jose'

export interface StatePayload {
  iat: number
  exp: number
  tenantId: string
  provider: string
  connectorId?: string // Optional for backward compatibility
  returnTo?: string
}

/**
 * Get the JWT secret key from environment
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.CONNECTOR_STATE_SECRET
  if (!secret) {
    throw new Error('CONNECTOR_STATE_SECRET environment variable is required')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Sign a state JWT with 10-minute expiration
 */
export async function signStateJWT(payload: Omit<StatePayload, 'iat' | 'exp'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + (10 * 60) // 10 minutes
  
  const jwt = await new SignJWT({
    ...payload,
    iat: now,
    exp
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(getSecretKey())
  
  return jwt
}

/**
 * Verify and decode a state JWT
 */
export async function verifyStateJWT(token: string): Promise<StatePayload> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256']
    })
    
    return payload as StatePayload
  } catch (error) {
    throw new Error(`Invalid state token: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate state payload structure
 */
export function validateStatePayload(payload: any): payload is StatePayload {
  return (
    payload &&
    typeof payload.iat === 'number' &&
    typeof payload.exp === 'number' &&
    typeof payload.tenantId === 'string' &&
    typeof payload.provider === 'string' &&
    (payload.connectorId === undefined || typeof payload.connectorId === 'string') &&
    (payload.returnTo === undefined || typeof payload.returnTo === 'string')
  )
}

/**
 * Check if state token is expired (with 30s buffer)
 */
export function isStateExpired(payload: StatePayload): boolean {
  const now = Math.floor(Date.now() / 1000)
  const buffer = 30 // 30 seconds buffer
  return now > (payload.exp - buffer)
}
