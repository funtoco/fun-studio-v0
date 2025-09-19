/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0
 * Implements RFC 7636 with S256 code challenge method
 */

import { createHash, randomBytes } from 'node:crypto'

export interface PKCEPair {
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: 'S256'
}

/**
 * Generate a cryptographically secure code verifier
 * RFC 7636: 43-128 characters, URL-safe base64 without padding
 */
export function generateCodeVerifier(): string {
  return randomBytes(32)
    .toString('base64url') // Node.js 14+ base64url encoding
    .slice(0, 43) // Ensure exactly 43 characters
}

/**
 * Generate code challenge from verifier using SHA256
 * RFC 7636: BASE64URL(SHA256(code_verifier))
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return createHash('sha256')
    .update(codeVerifier)
    .digest('base64url')
}

/**
 * Generate a complete PKCE pair for OAuth flow
 */
export function generatePKCEPair(): PKCEPair {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)
  
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256'
  }
}

/**
 * Verify that a code verifier matches the challenge
 * Used for testing and validation
 */
export function verifyPKCEPair(codeVerifier: string, codeChallenge: string): boolean {
  const expectedChallenge = generateCodeChallenge(codeVerifier)
  return expectedChallenge === codeChallenge
}

/**
 * Validate code verifier format according to RFC 7636
 */
export function isValidCodeVerifier(codeVerifier: string): boolean {
  // RFC 7636: 43-128 characters, [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
  const regex = /^[A-Za-z0-9\-\._~]{43,128}$/
  return regex.test(codeVerifier)
}
