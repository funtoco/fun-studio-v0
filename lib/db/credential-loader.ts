/**
 * Credential loader with auto-detection for plaintext vs encrypted payloads
 */

import { createClient } from '@supabase/supabase-js'
import { parseMaybeJsonOrEncrypted } from '@/lib/credentials/parse'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

export async function loadKintoneClientConfig(connectorId: string): Promise<{
  clientId: string
  clientSecret: string
  domain: string
  redirectUri: string
}> {
  console.log(`[kintone-auth] Loading config for connectorId=${connectorId}`)
  
  const supabase = getServerClient()
  
  // Get kintone_config credential row
  const { data: row, error } = await supabase
    .from('credentials')
    .select('type, payload, payload_encrypted, format')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_config')
    .single()
  
  if (error) {
    throw new Error(`Failed to load credentials: ${error.message}`)
  }
  
  if (!row) {
    throw new Error(`No kintone_config found for connectorId=${connectorId}`)
  }
  
  console.log(`[kintone-auth] Found credential row, format=${row.format || 'auto-detect'}`)
  
  // Parse the config with priority: payload (plain) first, then payload_encrypted (encrypted)
  let config
  if (row.payload && (row.format === 'plain' || !row.format)) {
    // Plain text JSON
    console.log(`[kintone-auth] Using plain text payload`)
    config = JSON.parse(row.payload)
  } else if (row.payload_encrypted) {
    // Encrypted payload - use robust parser
    console.log(`[kintone-auth] Using encrypted payload`)
    config = parseMaybeJsonOrEncrypted(null, row.payload_encrypted)
  } else {
    throw new Error(`No valid payload found for connectorId=${connectorId}`)
  }
  
  if (!config.clientId) {
    throw new Error(`clientId empty for connectorId=${connectorId}`)
  }
  
  if (!config.clientSecret) {
    throw new Error(`clientSecret empty for connectorId=${connectorId}`)
  }
  
  if (!config.domain) {
    throw new Error(`domain empty for connectorId=${connectorId}`)
  }
  
  console.log(`[kintone-auth] loaded credential type=kintone_config format=${row.format || 'auto-detected'}`)
  
  // Extract subdomain from domain URL
  const subdomain = config.domain.replace('https://', '').replace('.cybozu.com', '')
  
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    domain: subdomain,
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'}/api/integrations/kintone/callback`
  }
}

