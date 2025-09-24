-- Rebuild connector system for multi-tenant use
-- Drop existing tables and recreate with proper structure

-- Drop existing connector tables
DROP TABLE IF EXISTS public.connector_logs CASCADE;
DROP TABLE IF EXISTS public.oauth_credentials CASCADE;
DROP TABLE IF EXISTS public.connector_secrets CASCADE;
DROP TABLE IF EXISTS public.connectors CASCADE;

-- Create new connectors table
CREATE TABLE IF NOT EXISTS public.connectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  provider text NOT NULL, -- 'kintone', 'hubspot', etc.
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credentials table for encrypted storage
CREATE TABLE IF NOT EXISTS public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id uuid NOT NULL REFERENCES public.connectors(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'oauth_token', 'client_secret', 'domain', 'subdomain'
  payload_encrypted bytea NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create connection status table
CREATE TABLE IF NOT EXISTS public.connection_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connector_id uuid NOT NULL REFERENCES public.connectors(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  last_error text,
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_connectors_tenant_provider ON public.connectors(tenant_id, provider);
CREATE INDEX IF NOT EXISTS idx_credentials_connector_type ON public.credentials(connector_id, type);
CREATE INDEX IF NOT EXISTS idx_connection_status_connector ON public.connection_status(connector_id);

-- Enable RLS
ALTER TABLE public.connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow public access for now - adjust for production)
CREATE POLICY "Allow public access on connectors" ON public.connectors FOR ALL USING (true);
CREATE POLICY "Allow public access on credentials" ON public.credentials FOR ALL USING (true);
CREATE POLICY "Allow public access on connection_status" ON public.connection_status FOR ALL USING (true);
