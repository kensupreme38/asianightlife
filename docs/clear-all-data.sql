-- ============================================================================
-- WARNING: This script will DELETE ALL DATA from the DJ voting system
-- ============================================================================
-- This includes:
--   - All votes
--   - All DJ profiles
--
-- USE WITH CAUTION! This action cannot be undone.
-- Make sure you have a backup before running this script.
-- ============================================================================

-- Disable RLS temporarily to allow deletion
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE djs DISABLE ROW LEVEL SECURITY;

-- Delete all votes first (due to foreign key constraint)
DELETE FROM votes;

-- Delete all DJ profiles
DELETE FROM djs;

-- Re-enable RLS
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;

-- Reset sequences (optional - uncomment if you want to reset auto-increment IDs)
-- ALTER SEQUENCE votes_id_seq RESTART WITH 1;
-- ALTER SEQUENCE djs_id_seq RESTART WITH 1;

-- Verify deletion
SELECT 
  (SELECT COUNT(*) FROM votes) AS votes_count,
  (SELECT COUNT(*) FROM djs) AS djs_count;

-- ============================================================================
-- Script completed
-- ============================================================================

