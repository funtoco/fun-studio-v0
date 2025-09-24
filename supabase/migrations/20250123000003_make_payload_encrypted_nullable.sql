-- Make payload_encrypted nullable to allow plain text storage
ALTER TABLE public.credentials 
ALTER COLUMN payload_encrypted DROP NOT NULL;
