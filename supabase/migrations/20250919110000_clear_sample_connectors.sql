-- Clear existing sample connector data for fresh testing
-- This allows users to create new connectors via the wizard

-- Clear existing data
DELETE FROM connector_logs;
DELETE FROM oauth_credentials;
DELETE FROM connector_secrets;
DELETE FROM connectors;

-- Keep tenants for reference
-- DELETE FROM tenants; -- Keep this commented to preserve tenants

-- Note: After this migration, use the Add Connector wizard to create new connectors
