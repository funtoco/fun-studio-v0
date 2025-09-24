-- Add format column to credentials table
ALTER TABLE public.credentials 
ADD COLUMN IF NOT EXISTS format text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_credentials_format ON public.credentials(format);
