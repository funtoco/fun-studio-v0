-- Fix connector status from error to connected
UPDATE connectors 
SET 
  status = 'connected',
  error_message = NULL,
  updated_at = NOW()
WHERE 
  id = 'f4c9a802-1c4a-4659-82e8-0eec484810f7'
  AND status = 'error';
