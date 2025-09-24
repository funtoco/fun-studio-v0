-- Add payload column to credentials table for plain text storage
ALTER TABLE public.credentials 
ADD COLUMN IF NOT EXISTS payload text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_credentials_payload ON public.credentials(payload);
