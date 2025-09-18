-- Re-enable RLS after debugging
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- The existing policies should still be in place:
-- 1. "Allow all operations for authenticated users" - for authenticated users
-- 2. "Allow public read access" - for unauthenticated read access
