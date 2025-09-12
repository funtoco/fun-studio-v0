-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  kana TEXT,
  nationality TEXT,
  dob DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  company TEXT,
  note TEXT,
  visa_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_people_visa_id ON people(visa_id);
CREATE INDEX IF NOT EXISTS idx_people_nationality ON people(nationality);
CREATE INDEX IF NOT EXISTS idx_people_created_at ON people(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- You can modify this policy based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON people
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

