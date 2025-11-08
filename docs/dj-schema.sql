-- ============================================================================
-- DJ Voting System - Database Schema
-- ============================================================================
-- This file contains the complete database schema for the DJ voting system
-- including tables, indexes, constraints, and views.

-- ============================================================================
-- Table: djs
-- ============================================================================
-- Stores DJ profile information

CREATE TABLE IF NOT EXISTS djs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  bio TEXT,
  genres TEXT[] DEFAULT '{}',
  country VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT djs_name_not_empty CHECK (LENGTH(TRIM(name)) > 0),
  CONSTRAINT djs_user_id_unique UNIQUE (user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_djs_user_id ON djs(user_id);
CREATE INDEX IF NOT EXISTS idx_djs_status ON djs(status);
CREATE INDEX IF NOT EXISTS idx_djs_is_active ON djs(is_active);
CREATE INDEX IF NOT EXISTS idx_djs_created_at ON djs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_djs_country ON djs(country);
CREATE INDEX IF NOT EXISTS idx_djs_genres ON djs USING GIN(genres);

-- ============================================================================
-- Table: votes
-- ============================================================================
-- Stores user votes for DJs

CREATE TABLE IF NOT EXISTS votes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dj_id BIGINT NOT NULL REFERENCES djs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT votes_user_dj_unique UNIQUE (user_id, dj_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_dj_id ON votes(dj_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_user_dj ON votes(user_id, dj_id);

-- ============================================================================
-- Functions
-- ============================================================================

-- Drop existing triggers first (they depend on functions)
DROP TRIGGER IF EXISTS trigger_update_djs_updated_at ON djs;

-- Drop existing functions if they exist (to avoid conflicts)
DROP FUNCTION IF EXISTS get_dj_votes_count(BIGINT);
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Function to get DJ votes count
CREATE OR REPLACE FUNCTION get_dj_votes_count(p_dj_id BIGINT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM votes WHERE dj_id = p_dj_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger to automatically update updated_at on djs table
CREATE TRIGGER trigger_update_djs_updated_at
  BEFORE UPDATE ON djs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Views
-- ============================================================================

-- Drop existing views if they exist (to avoid conflicts)
DROP VIEW IF EXISTS dj_stats CASCADE;
DROP VIEW IF EXISTS active_djs CASCADE;
DROP VIEW IF EXISTS user_votes_summary CASCADE;

-- View: dj_stats
-- Provides DJ statistics including vote counts and rankings
CREATE OR REPLACE VIEW dj_stats AS
SELECT 
  d.id,
  d.name,
  d.user_id,
  d.image_url,
  d.bio,
  d.country,
  d.genres,
  d.status,
  d.is_active,
  d.created_at,
  d.updated_at,
  COUNT(v.id) AS votes_count,
  ROW_NUMBER() OVER (ORDER BY COUNT(v.id) DESC, d.created_at ASC) AS rank,
  COUNT(DISTINCT v.user_id) AS unique_voters
FROM djs d
LEFT JOIN votes v ON d.id = v.dj_id
WHERE d.is_active = TRUE AND d.status = 'active'
GROUP BY d.id, d.name, d.user_id, d.image_url, d.bio, d.country, d.genres, 
         d.status, d.is_active, d.created_at, d.updated_at;

-- View: active_djs
-- Shows only active DJ profiles with basic information
CREATE OR REPLACE VIEW active_djs AS
SELECT 
  id,
  name,
  user_id,
  image_url,
  bio,
  genres,
  country,
  created_at
FROM djs
WHERE is_active = TRUE AND status = 'active'
ORDER BY created_at DESC;

-- View: user_votes_summary
-- Shows vote summary for each user
CREATE OR REPLACE VIEW user_votes_summary AS
SELECT 
  v.user_id,
  COUNT(v.id) AS total_votes,
  COUNT(DISTINCT v.dj_id) AS unique_djs_voted,
  MIN(v.created_at) AS first_vote_at,
  MAX(v.created_at) AS last_vote_at
FROM votes v
GROUP BY v.user_id;

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on djs table
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active DJs" ON djs;
DROP POLICY IF EXISTS "Users can create their own DJ profile" ON djs;
DROP POLICY IF EXISTS "Users can update their own DJ profile" ON djs;
DROP POLICY IF EXISTS "Users can delete their own DJ profile" ON djs;

-- Policy: Anyone can read active DJs
CREATE POLICY "Anyone can view active DJs"
  ON djs FOR SELECT
  USING (is_active = TRUE AND status = 'active');

-- Policy: Users can insert their own DJ profile
CREATE POLICY "Users can create their own DJ profile"
  ON djs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own DJ profile
CREATE POLICY "Users can update their own DJ profile"
  ON djs FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own DJ profile
CREATE POLICY "Users can delete their own DJ profile"
  ON djs FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on votes table
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;
DROP POLICY IF EXISTS "Authenticated users can vote" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Policy: Users can view all votes
CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  USING (true);

-- Policy: Authenticated users can vote
CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE djs IS 'Stores DJ profile information';
COMMENT ON TABLE votes IS 'Stores user votes for DJs';
COMMENT ON VIEW dj_stats IS 'View showing DJ statistics including vote counts and rankings';
COMMENT ON VIEW active_djs IS 'View showing only active DJ profiles';
COMMENT ON VIEW user_votes_summary IS 'View showing vote summary for each user';
COMMENT ON FUNCTION get_dj_votes_count IS 'Returns the total vote count for a specific DJ';
COMMENT ON FUNCTION update_updated_at_column IS 'Automatically updates the updated_at column when a row is updated';

