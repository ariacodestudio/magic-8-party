-- Fix Realtime for Magic 8 Ball
-- Run these commands in Supabase SQL Editor

-- Step 1: Remove table from publication (ignore error if it doesn't exist)
ALTER PUBLICATION supabase_realtime DROP TABLE answers;
-- Note: If you get an error "relation "answers" is not part of the publication", that's fine, continue to step 2

-- Step 2: Add table back to publication
ALTER PUBLICATION supabase_realtime ADD TABLE answers;

-- Step 3: Verify it worked - should return 'answers'
SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Step 4: Test with an insert
INSERT INTO answers (message) 
VALUES ('Realtime test: ' || now()::text);

-- Step 5: Check it was inserted
SELECT * FROM answers 
ORDER BY created_at DESC 
LIMIT 1;
