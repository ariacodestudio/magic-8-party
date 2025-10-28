-- Enable Realtime for the answers table
-- Run this in Supabase SQL Editor

-- First, make sure the table exists
CREATE TABLE IF NOT EXISTS answers (
  id uuid default gen_random_uuid() primary key,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
DROP POLICY IF EXISTS "Allow anonymous access" ON answers;
CREATE POLICY "Allow anonymous access" ON answers
  FOR ALL USING (true);

-- CRITICAL: Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- Verify it's enabled (should show 'answers' in the results)
SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
