-- Complete Supabase Setup for Magic 8 Party
-- Run these commands in order in your Supabase SQL Editor

-- Step 1: Create the answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Step 2: Enable Row Level Security (RLS)
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a policy to allow all operations (for demo/party use)
DROP POLICY IF EXISTS "Allow all" ON answers;
CREATE POLICY "Allow all" ON answers 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Step 4: CRITICAL - Enable Realtime for the answers table
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- Step 5: Verify everything is set up correctly
-- This should return 'answers' if realtime is enabled
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Step 6: Test by inserting a sample answer
INSERT INTO answers (message) 
VALUES ('Setup test: It is certain!');

-- Step 7: Verify the insert worked
SELECT * FROM answers 
ORDER BY created_at DESC 
LIMIT 1;

-- If all commands run without errors, your Supabase is ready! 🎉
