-- Add email column to user_tenants table
ALTER TABLE user_tenants ADD COLUMN IF NOT EXISTS email text;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_tenants_email ON user_tenants(email);
