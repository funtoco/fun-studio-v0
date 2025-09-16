-- Create support_actions table
CREATE TABLE IF NOT EXISTS support_actions (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'done')),
  assignee TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_support_actions_person_id ON support_actions(person_id);
CREATE INDEX IF NOT EXISTS idx_support_actions_category ON support_actions(category);
CREATE INDEX IF NOT EXISTS idx_support_actions_status ON support_actions(status);
CREATE INDEX IF NOT EXISTS idx_support_actions_assignee ON support_actions(assignee);
CREATE INDEX IF NOT EXISTS idx_support_actions_due_date ON support_actions(due_date);
CREATE INDEX IF NOT EXISTS idx_support_actions_created_at ON support_actions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE support_actions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON support_actions
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_actions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_support_actions_updated_at
  BEFORE UPDATE ON support_actions
  FOR EACH ROW
  EXECUTE FUNCTION update_support_actions_updated_at();


