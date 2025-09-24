/**
 * AES-256-CBC encryption utilities for sensitive data
 * Used to encrypt OAuth tokens before storing in database
 */

import { createCipher, createDecipher, randomBytes } from 'node:crypto'

/**
 * Get the encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.CREDENTIALS_ENC_KEY
  if (!key) {
    throw new Error('CREDENTIALS_ENC_KEY environment variable is required')
  }
  
  const keyBuffer = Buffer.from(key, 'base64')
  if (keyBuffer.length !== 32) {
    throw new Error('CREDENTIALS_ENC_KEY must be a 32-byte key (base64 encoded)')
  }
  
  return keyBuffer
}

/**
 * Encrypt JSON data using AES-256-CBC
 */
export function encryptJson(data: any): string {
  const key = getEncryptionKey()
  const iv = randomBytes(16) // 16 bytes for AES-256-CBC
  const cipher = createCipher('aes-256-cbc', key)
  
  const plaintext = JSON.stringify(data)
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  // Combine IV + ciphertext
  const combined = Buffer.concat([iv, Buffer.from(encrypted, 'hex')])
  return combined.toString('base64')
}

/**
 * Decrypt JSON data using AES-256-CBC
 */
export function decryptJson(encryptedData: string): any {
  const key = getEncryptionKey()
  
  // Decode from base64
  const combined = Buffer.from(encryptedData, 'base64')
  
  // Extract IV (first 16 bytes) and ciphertext (rest)
  const iv = combined.subarray(0, 16)
  const ciphertext = combined.subarray(16)
  
  const decipher = createDecipher('aes-256-cbc', key)
  
  let decrypted = decipher.update(ciphertext, undefined, 'utf8')
  decrypted += decipher.final('utf8')
  
  return JSON.parse(decrypted)
}

/**
 * Encrypt a simple string value
 */
export function encrypt(value: string): string {
  return encryptJson({ value })
}

/**
 * Decrypt a simple string value
 */
export function decrypt(encryptedValue: string): string {
  const data = decryptJson(encryptedValue)
  return data.value
}