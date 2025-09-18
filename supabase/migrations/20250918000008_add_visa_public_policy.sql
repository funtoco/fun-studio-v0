-- Add policy to allow public read access to visas table
CREATE POLICY "Allow public read access" ON visas
  FOR SELECT USING (true);

-- Note: This is for development purposes only
-- In production, you should remove this policy and ensure proper authentication
