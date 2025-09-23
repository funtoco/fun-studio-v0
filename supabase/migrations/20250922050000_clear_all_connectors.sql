-- Clear all connectors for fresh start with real credentials
DELETE FROM connector_logs;
DELETE FROM oauth_credentials;
DELETE FROM connector_secrets;
DELETE FROM connectors;
