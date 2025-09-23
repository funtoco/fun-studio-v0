-- Clear all sample connector data for fresh start
-- This will remove all existing connectors and related data

-- Delete all connector logs
DELETE FROM connector_logs;

-- Delete all oauth credentials  
DELETE FROM oauth_credentials;

-- Delete all connector secrets
DELETE FROM connector_secrets;

-- Delete all connectors
DELETE FROM connectors;

-- Reset any sequences if needed
-- Note: This is a complete reset, so all existing data will be lost
