-- Add email column to user_tenants table
ALTER TABLE user_tenants ADD COLUMN email TEXT;

-- Create index for email column
CREATE INDEX IF NOT EXISTS idx_user_tenants_email ON user_tenants(email);

-- Update existing records with email from auth.users
-- Note: This is a one-time migration for existing data
UPDATE user_tenants 
SET email = (
  SELECT raw_user_meta_data->>'email' 
  FROM auth.users 
  WHERE auth.users.id = user_tenants.user_id
)
WHERE email IS NULL;

-- Make email column NOT NULL after updating existing records
ALTER TABLE user_tenants ALTER COLUMN email SET NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own tenant relationships" ON user_tenants;
DROP POLICY IF EXISTS "Users can view tenant members" ON user_tenants;
DROP POLICY IF EXISTS "Tenant owners and admins can manage members" ON user_tenants;
DROP POLICY IF EXISTS "Users can insert their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can update their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON user_tenants;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON user_tenants;

-- Create simplified RLS policies
-- Users can view user_tenants records for tenants they belong to
CREATE POLICY "Users can view tenant members" ON user_tenants
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM user_tenants 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- Users can insert their own memberships (for signup)
CREATE POLICY "Users can insert their own memberships" ON user_tenants
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Users can update their own memberships
CREATE POLICY "Users can update their own memberships" ON user_tenants
  FOR UPDATE USING (user_id = auth.uid());

-- Users can delete their own memberships
CREATE POLICY "Users can delete their own memberships" ON user_tenants
  FOR DELETE USING (user_id = auth.uid());
