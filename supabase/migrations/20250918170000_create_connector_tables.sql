-- Enable RLS
ALTER DATABASE postgres SET "app.current_tenant_id" = '';

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create connector_types table
CREATE TABLE IF NOT EXISTS connector_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'kintone', 'salesforce', 'hubspot', etc
  display_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create connectors table (tenant-specific connections)
CREATE TABLE IF NOT EXISTS connectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  connector_type_id UUID NOT NULL REFERENCES connector_types(id),
  name TEXT NOT NULL,
  subdomain TEXT, -- for kintone: 'funtoco' in 'funtoco.cybozu.com'
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
  
  -- OAuth credentials (encrypted)
  oauth_client_id TEXT,
  oauth_client_secret TEXT, -- encrypted
  oauth_access_token TEXT, -- encrypted
  oauth_refresh_token TEXT, -- encrypted
  oauth_token_expires_at TIMESTAMP WITH TIME ZONE,
  oauth_scopes TEXT[], -- array of scopes
  
  -- Connection metadata
  last_sync_at TIMESTAMP WITH TIME ZONE,
  last_error TEXT,
  sync_frequency_minutes INTEGER DEFAULT 60, -- sync every hour by default
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Unique constraint: one connector per type per tenant
  UNIQUE(tenant_id, connector_type_id, subdomain)
);

-- Create kintone_apps table (apps discovered from connected Kintone)
CREATE TABLE IF NOT EXISTS kintone_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  kintone_app_id TEXT NOT NULL, -- Kintone's internal app ID
  app_code TEXT NOT NULL,
  app_name TEXT NOT NULL,
  description TEXT,
  
  -- Sync settings
  is_sync_enabled BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  record_count INTEGER DEFAULT 0,
  
  -- Field mapping
  field_mappings JSONB DEFAULT '{}', -- store field mappings as JSON
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(connector_id, kintone_app_id)
);

-- Create sync_logs table (track all sync activities)
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id UUID NOT NULL REFERENCES connectors(id) ON DELETE CASCADE,
  kintone_app_id UUID REFERENCES kintone_apps(id) ON DELETE CASCADE,
  
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  
  -- Sync metrics
  records_processed INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  
  -- Error handling
  error_message TEXT,
  error_details JSONB,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- Insert default connector types
INSERT INTO connector_types (name, display_name, description, logo_url) VALUES
('kintone', 'Kintone', 'Cybozu Kintone cloud database platform', '/connectors/kintone.png'),
('hubspot', 'HubSpot', 'Customer relationship management platform', '/connectors/hubspot.png'),
('slack', 'Slack', 'Team communication platform', '/connectors/slack.png'),
('salesforce', 'Salesforce', 'Customer relationship management platform', '/connectors/salesforce.png'),
('notion', 'Notion', 'All-in-one workspace', '/connectors/notion.png')
ON CONFLICT DO NOTHING;

-- Insert sample tenants
INSERT INTO tenants (name, slug) VALUES
('慈誠会', 'jiseikai'),
('Funtoco', 'funtoco')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE kintone_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenants
CREATE POLICY "Users can view their own tenant" ON tenants
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS Policies for connectors (tenant-isolated)
CREATE POLICY "Users can view connectors for their tenant" ON connectors
  FOR ALL USING (
    tenant_id IN (
      SELECT t.id FROM tenants t 
      WHERE t.slug = current_setting('app.current_tenant_id', true)
    )
  );

-- RLS Policies for kintone_apps
CREATE POLICY "Users can view kintone apps for their tenant connectors" ON kintone_apps
  FOR ALL USING (
    connector_id IN (
      SELECT c.id FROM connectors c
      JOIN tenants t ON c.tenant_id = t.id
      WHERE t.slug = current_setting('app.current_tenant_id', true)
    )
  );

-- RLS Policies for sync_logs
CREATE POLICY "Users can view sync logs for their tenant connectors" ON sync_logs
  FOR ALL USING (
    connector_id IN (
      SELECT c.id FROM connectors c
      JOIN tenants t ON c.tenant_id = t.id
      WHERE t.slug = current_setting('app.current_tenant_id', true)
    )
  );

-- Create indexes for performance
CREATE INDEX idx_connectors_tenant_id ON connectors(tenant_id);
CREATE INDEX idx_connectors_status ON connectors(status);
CREATE INDEX idx_kintone_apps_connector_id ON kintone_apps(connector_id);
CREATE INDEX idx_sync_logs_connector_id ON sync_logs(connector_id);
CREATE INDEX idx_sync_logs_started_at ON sync_logs(started_at DESC);
