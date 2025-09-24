/**
 * Testing utilities for crypto functions
 */

import { testCrypto } from '../security/crypto'
import { generatePKCEPair, verifyPKCEPair } from '../security/pkce'
import { signStateJWT, verifyStateJWT } from '../security/state'

export async function runCryptoTests(): Promise<boolean> {
  console.log('🧪 Running crypto tests...')
  
  try {
    // Test encryption/decryption
    console.log('Testing encryption/decryption...')
    const cryptoResult = testCrypto()
    if (!cryptoResult) {
      console.error('❌ Crypto test failed')
      return false
    }
    console.log('✅ Crypto test passed')
    
    // Test PKCE
    console.log('Testing PKCE...')
    const pkce = generatePKCEPair()
    const pkceValid = verifyPKCEPair(pkce.codeVerifier, pkce.codeChallenge)
    if (!pkceValid) {
      console.error('❌ PKCE test failed')
      return false
    }
    console.log('✅ PKCE test passed')
    
    // Test JWT state
    console.log('Testing JWT state...')
    const statePayload = {
      tenantId: 'test-tenant',
      provider: 'kintone' as const,
      returnTo: '/test'
    }
    const stateJwt = await signStateJWT(statePayload)
    const verifiedState = await verifyStateJWT(stateJwt)
    
    if (
      verifiedState.tenantId !== statePayload.tenantId ||
      verifiedState.provider !== statePayload.provider ||
      verifiedState.returnTo !== statePayload.returnTo
    ) {
      console.error('❌ JWT state test failed')
      return false
    }
    console.log('✅ JWT state test passed')
    
    console.log('🎉 All crypto tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Crypto tests failed:', error)
    return false
  }
}

export async function testConnectorSystem(): Promise<void> {
  console.log('🔌 Testing connector system...')
  
  if (process.env.NODE_ENV !== 'development') {
    console.log('⚠️  Connector tests only run in development mode')
    return
  }
  
  // Test environment variables
  const requiredEnvVars = [
    'CONNECTOR_STATE_SECRET',
    'CREDENTIALS_ENC_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ]
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '))
    return
  }
  
  console.log('✅ Environment variables configured')
  
  // Run crypto tests
  const cryptoTestsPass = await runCryptoTests()
  if (!cryptoTestsPass) {
    console.error('❌ Crypto tests failed')
    return
  }
  
  console.log('🎉 Connector system tests passed!')
}
