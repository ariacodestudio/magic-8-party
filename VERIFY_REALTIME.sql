-- Verify that Realtime is enabled for the answers table
-- This should return 'answers' if everything is set up correctly

SELECT tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- If you see 'answers' in the results, realtime is enabled! ✅
