-- Create connector system tables for multi-tenant OAuth connections
-- This replaces the previous connector tables with proper OAuth support

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS sync_logs CASCADE;
DROP TABLE IF EXISTS field_mappings CASCADE;
DROP TABLE IF EXISTS app_mappings CASCADE;
DROP TABLE IF EXISTS kintone_fields CASCADE;
DROP TABLE IF EXISTS kintone_apps CASCADE;
DROP TABLE IF EXISTS connectors CASCADE;
DROP TABLE IF EXISTS connector_types CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- Tenants table (multi-tenant support)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connectors table (OAuth-enabled)
CREATE TABLE IF NOT EXISTS connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('kintone','hubspot')),
  subdomain TEXT,                -- required for kintone
  oauth_client_id TEXT,          -- server-side only
  oauth_client_secret TEXT,      -- store server-side (optionally encrypted)
  scopes TEXT[],
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected','disconnected','error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth credentials table (encrypted tokens)
CREATE TABLE IF NOT EXISTS oauth_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES connectors(id) ON DELETE CASCADE,
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT,
  expires_at TIMESTAMPTZ,
  token_type TEXT DEFAULT 'Bearer',
  raw_provider_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connector logs table
CREATE TABLE IF NOT EXISTS connector_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES connectors(id) ON DELETE CASCADE,
  level TEXT CHECK (level IN ('info','warn','error')),
  event TEXT CHECK (event IN ('authorize_start','authorize_callback','token_saved','token_refreshed','disconnected','error','connection_test')),
  detail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS uniq_tenant_provider ON connectors(tenant_id, provider);
CREATE INDEX IF NOT EXISTS idx_connectors_status ON connectors(status);
CREATE INDEX IF NOT EXISTS idx_oauth_credentials_connector ON oauth_credentials(connector_id);
CREATE INDEX IF NOT EXISTS idx_connector_logs_connector ON connector_logs(connector_id, created_at DESC);

-- RLS policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE oauth_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE connector_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for now (adjust for production)
CREATE POLICY "Allow public read access on tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Allow public read access on connectors" ON connectors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on oauth_credentials" ON oauth_credentials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on connector_logs" ON connector_logs FOR SELECT USING (true);

-- Allow public insert/update for OAuth flow
CREATE POLICY "Allow public insert on connectors" ON connectors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on connectors" ON connectors FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on oauth_credentials" ON oauth_credentials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on oauth_credentials" ON oauth_credentials FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on connector_logs" ON connector_logs FOR INSERT WITH CHECK (true);

-- Seed data: Create default tenants
INSERT INTO tenants (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Funtoco'),
  ('550e8400-e29b-41d4-a716-446655440002', '慈誠会')
ON CONFLICT (id) DO NOTHING;

-- Seed data: Create sample connectors
INSERT INTO connectors (id, tenant_id, provider, subdomain, oauth_client_id, oauth_client_secret, scopes, status) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001', 
    '550e8400-e29b-41d4-a716-446655440001', 
    'kintone', 
    'funtoco', 
    'FunStudio_OAuth_Client', 
    'your_client_secret_here', 
    ARRAY['k:app_record:read', 'k:app_settings:read'], 
    'disconnected'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002', 
    '550e8400-e29b-41d4-a716-446655440002', 
    'kintone', 
    'jiseikai', 
    'Dev_OAuth_Client', 
    'dev_client_secret_here', 
    ARRAY['k:app_record:read', 'k:app_settings:read'], 
    'error'
  )
ON CONFLICT (tenant_id, provider) DO NOTHING;

-- Add sample error message for testing
UPDATE connectors 
SET error_message = 'OAuth client configuration required' 
WHERE status = 'error';

-- Seed data: Create sample logs
INSERT INTO connector_logs (connector_id, level, event, detail) VALUES 
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'info',
    'authorize_start',
    '{"redirect_uri": "http://localhost:3000/api/connect/kintone/callback", "scopes": ["k:app_record:read", "k:app_settings:read"]}'::jsonb
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'error',
    'error',
    '{"error": "OAuth client not configured", "message": "Client ID and secret required for OAuth flow"}'::jsonb
  );
