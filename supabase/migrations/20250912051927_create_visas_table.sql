-- Create visas table
CREATE TABLE IF NOT EXISTS visas (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN (
    '書類準備中',
    '書類作成中', 
    '書類確認中',
    '申請準備中',
    'ビザ申請準備中',
    '申請中',
    'ビザ取得済み'
  )),
  type TEXT NOT NULL CHECK (type IN ('新規', '更新')),
  expiry_date DATE,
  submitted_at TIMESTAMPTZ,
  result_at TIMESTAMPTZ,
  manager TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visas_person_id ON visas(person_id);
CREATE INDEX IF NOT EXISTS idx_visas_status ON visas(status);
CREATE INDEX IF NOT EXISTS idx_visas_type ON visas(type);
CREATE INDEX IF NOT EXISTS idx_visas_expiry_date ON visas(expiry_date);
CREATE INDEX IF NOT EXISTS idx_visas_updated_at ON visas(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON visas
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_visas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER update_visas_updated_at
  BEFORE UPDATE ON visas
  FOR EACH ROW
  EXECUTE FUNCTION update_visas_updated_at();
