-- Fix connection_status table constraint
-- Add unique constraint on connector_id for upsert to work

-- First, check if there are duplicate connector_ids and clean them up
DELETE FROM public.connection_status 
WHERE id NOT IN (
  SELECT DISTINCT ON (connector_id) id 
  FROM public.connection_status 
  ORDER BY connector_id, updated_at DESC
);

-- Add unique constraint on connector_id
ALTER TABLE public.connection_status 
ADD CONSTRAINT connection_status_connector_id_unique UNIQUE (connector_id);
