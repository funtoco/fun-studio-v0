/**
 * AES-256-GCM encryption utilities for sensitive data
 * Used to encrypt OAuth tokens before storing in database
 */

import { createCipherGCM, createDecipherGCM, randomBytes } from 'node:crypto'

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
 * Encrypt JSON data using AES-256-GCM
 */
export function encryptJson(data: any): string {
  const key = getEncryptionKey()
  const iv = randomBytes(12) // 12 bytes for GCM
  const cipher = createCipherGCM('aes-256-gcm', key)
  
  cipher.setAAD(Buffer.from('connector-oauth', 'utf8')) // Additional authenticated data
  
  const plaintext = JSON.stringify(data)
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  // Format: iv(24) + authTag(32) + encrypted(variable)
  return iv.toString('hex') + authTag.toString('hex') + encrypted
}

/**
 * Decrypt JSON data using AES-256-GCM
 */
export function decryptJson(encryptedData: string): any {
  const key = getEncryptionKey()
  
  // Parse the encrypted format
  const iv = Buffer.from(encryptedData.slice(0, 24), 'hex')
  const authTag = Buffer.from(encryptedData.slice(24, 56), 'hex')
  const encrypted = encryptedData.slice(56)
  
  const decipher = createDecipherGCM('aes-256-gcm', key)
  decipher.setAuthTag(authTag)
  decipher.setAAD(Buffer.from('connector-oauth', 'utf8'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return JSON.parse(decrypted)
}

/**
 * Encrypt a simple string value
 */
export function encryptString(value: string): string {
  return encryptJson({ value })
}

/**
 * Decrypt a simple string value
 */
export function decryptString(encryptedData: string): string {
  const data = decryptJson(encryptedData)
  return data.value
}

/**
 * Test encryption/decryption with sample data
 */
export function testCrypto(): boolean {
  try {
    const testData = { 
      access_token: 'test_token_123', 
      refresh_token: 'refresh_456',
      expires_in: 3600,
      timestamp: Date.now()
    }
    
    const encrypted = encryptJson(testData)
    const decrypted = decryptJson(encrypted)
    
    return JSON.stringify(testData) === JSON.stringify(decrypted)
  } catch (error) {
    console.error('Crypto test failed:', error)
    return false
  }
}
