-- Add name field to connectors table and update structure
-- This makes the connector system more user-friendly

-- Add name field to connectors
ALTER TABLE connectors 
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add auth_method field for future extensibility
ALTER TABLE connectors 
ADD COLUMN IF NOT EXISTS auth_method TEXT NOT NULL DEFAULT 'oauth';

-- Update existing connectors to have proper names based on their config
UPDATE connectors 
SET name = CASE 
  WHEN provider = 'kintone' AND provider_config->>'subdomain' IS NOT NULL 
    THEN 'Kintone (' || (provider_config->>'subdomain') || ')'
  WHEN provider = 'hubspot' AND provider_config->>'portalId' IS NOT NULL
    THEN 'HubSpot (' || (provider_config->>'portalId') || ')'
  WHEN provider = 'kintone'
    THEN 'Kintone Connector'
  WHEN provider = 'hubspot'
    THEN 'HubSpot Connector'
  ELSE provider || ' Connector'
END
WHERE name IS NULL;

-- Make name field required going forward
ALTER TABLE connectors 
ALTER COLUMN name SET NOT NULL;

-- Add helpful indexes for search and filtering
CREATE INDEX IF NOT EXISTS idx_connectors_name_search ON connectors USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_connectors_provider_config_subdomain ON connectors((provider_config->>'subdomain'));
CREATE INDEX IF NOT EXISTS idx_connectors_status_updated ON connectors(status, updated_at DESC);

-- Add constraint for auth_method
ALTER TABLE connectors 
ADD CONSTRAINT connectors_auth_method_check 
CHECK (auth_method IN ('oauth', 'api_token'));

-- Add constraint for status
ALTER TABLE connectors 
DROP CONSTRAINT IF EXISTS connectors_status_check;

ALTER TABLE connectors 
ADD CONSTRAINT connectors_status_check 
CHECK (status IN ('connected', 'disconnected', 'error'));

-- Add constraint for provider
ALTER TABLE connectors 
DROP CONSTRAINT IF EXISTS connectors_provider_check;

ALTER TABLE connectors 
ADD CONSTRAINT connectors_provider_check 
CHECK (provider IN ('kintone', 'hubspot'));

-- Add helpful comments
COMMENT ON COLUMN connectors.name IS 'User-friendly display name for the connector';
COMMENT ON COLUMN connectors.provider_config IS 'Provider-specific configuration (subdomain for Kintone, portalId for HubSpot, etc.)';
COMMENT ON COLUMN connectors.auth_method IS 'Authentication method: oauth (default) or api_token (future)';
COMMENT ON TABLE connector_secrets IS 'Encrypted OAuth client credentials (Client ID and Secret)';
COMMENT ON TABLE oauth_credentials IS 'Encrypted OAuth tokens (access_token, refresh_token)';
COMMENT ON TABLE connector_logs IS 'Audit log for all connector operations';
