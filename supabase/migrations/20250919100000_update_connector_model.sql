-- Update connector model for BYOC (Bring Your Own Client) support
-- This migration updates the existing tables to support the new flexible model

-- First, backup existing data
CREATE TABLE IF NOT EXISTS connectors_backup AS SELECT * FROM connectors;
CREATE TABLE IF NOT EXISTS oauth_credentials_backup AS SELECT * FROM oauth_credentials;

-- Drop existing constraints and indexes that will change
DROP INDEX IF EXISTS uniq_tenant_provider;

-- Update connectors table structure
ALTER TABLE connectors 
  DROP COLUMN IF EXISTS subdomain,
  DROP COLUMN IF EXISTS oauth_client_id,
  DROP COLUMN IF EXISTS oauth_client_secret,
  ADD COLUMN IF NOT EXISTS provider_config JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Create new unique constraint including subdomain from config
CREATE UNIQUE INDEX IF NOT EXISTS uniq_tenant_provider_config 
ON connectors(tenant_id, provider, ((provider_config->>'subdomain')));

-- Create connector_secrets table for encrypted client credentials
CREATE TABLE IF NOT EXISTS connector_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID REFERENCES connectors(id) ON DELETE CASCADE UNIQUE,
  oauth_client_id_enc TEXT NOT NULL,
  oauth_client_secret_enc TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrate existing data to new structure
-- Update existing connectors with provider_config
UPDATE connectors 
SET provider_config = jsonb_build_object('subdomain', 
  CASE 
    WHEN provider = 'kintone' THEN 'funtoco'
    ELSE NULL
  END
)
WHERE provider_config = '{}'::jsonb;

-- Insert existing client credentials into connector_secrets (if any exist in backup)
-- Note: This would need actual encryption in production
-- For now, we'll clear existing credentials and require re-setup

-- Clear existing OAuth credentials since we're changing the model
DELETE FROM oauth_credentials;

-- Add RLS policies for new table
ALTER TABLE connector_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on connector_secrets" 
ON connector_secrets FOR SELECT USING (true);

CREATE POLICY "Allow public insert on connector_secrets" 
ON connector_secrets FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on connector_secrets" 
ON connector_secrets FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on connector_secrets" 
ON connector_secrets FOR DELETE USING (true);

-- Update existing connector statuses to disconnected since we're changing the model
UPDATE connectors SET status = 'disconnected', error_message = 'Client credentials required after migration';

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_connector_secrets_connector ON connector_secrets(connector_id);
CREATE INDEX IF NOT EXISTS idx_connectors_provider_config ON connectors USING gin(provider_config);
CREATE INDEX IF NOT EXISTS idx_connectors_tenant_status ON connectors(tenant_id, status);

-- Add environment variable for app URL (will be used in redirect URIs)
-- This is just documentation - actual env var needs to be set in .env.local
COMMENT ON TABLE connectors IS 'Connectors table - requires NEXT_PUBLIC_APP_URL env var for OAuth redirects';

-- Clean up backup tables (optional - keep for safety during development)
-- DROP TABLE IF EXISTS connectors_backup;
-- DROP TABLE IF EXISTS oauth_credentials_backup;
