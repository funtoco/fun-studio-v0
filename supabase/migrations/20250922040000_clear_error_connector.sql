-- Clear the error connector
DELETE FROM connector_logs WHERE connector_id = 'c8a6d89e-68e7-401a-8600-3fbb0d250e17';
DELETE FROM oauth_credentials WHERE connector_id = 'c8a6d89e-68e7-401a-8600-3fbb0d250e17';
DELETE FROM connector_secrets WHERE connector_id = 'c8a6d89e-68e7-401a-8600-3fbb0d250e17';
DELETE FROM connectors WHERE id = 'c8a6d89e-68e7-401a-8600-3fbb0d250e17';
