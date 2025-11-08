-- ============================================================================
-- Seed 24 Sample DJs
-- ============================================================================
-- This script inserts 24 sample DJ profiles into the database.
--
-- IMPORTANT: This script temporarily disables the foreign key constraint
-- to allow inserting DJs without existing users. The constraint will be
-- re-enabled after insertion.
--
-- If you want to associate these DJs with real users, you'll need to:
-- 1. Create users in auth.users first
-- 2. Update the user_id values in this script to match real user UUIDs
-- ============================================================================

-- Temporarily disable foreign key constraint and RLS
ALTER TABLE djs DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Drop the foreign key constraint temporarily
ALTER TABLE djs DROP CONSTRAINT IF EXISTS djs_user_id_fkey;

-- Insert 24 sample DJs
INSERT INTO djs (user_id, name, image_url, bio, genres, country, status, is_active, created_at) VALUES
-- DJ 1-8: EDM & House
('00000000-0000-0000-0000-000000000001', 'DJ Alex Thunder', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'International DJ and producer known for high-energy EDM sets. Performing at major festivals worldwide.', ARRAY['EDM', 'House', 'Progressive House'], 'United States', 'active', true, NOW() - INTERVAL '365 days'),
('00000000-0000-0000-0000-000000000002', 'Sarah Moonlight', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400', 'Rising star in the electronic music scene. Specializes in deep house and techno.', ARRAY['Deep House', 'Techno', 'Minimal'], 'Germany', 'active', true, NOW() - INTERVAL '340 days'),
('00000000-0000-0000-0000-000000000003', 'DJ Marcus Flow', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Veteran DJ with 15+ years of experience. Known for seamless mixing and crowd control.', ARRAY['House', 'Tech House', 'EDM'], 'United Kingdom', 'active', true, NOW() - INTERVAL '320 days'),
('00000000-0000-0000-0000-000000000004', 'Luna Electric', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'Female DJ breaking barriers in electronic music. Specializes in progressive and trance.', ARRAY['Progressive', 'Trance', 'EDM'], 'Netherlands', 'active', true, NOW() - INTERVAL '300 days'),
('00000000-0000-0000-0000-000000000005', 'DJ Phoenix', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Underground techno specialist. Known for dark, industrial soundscapes.', ARRAY['Techno', 'Industrial', 'Minimal'], 'Belgium', 'active', true, NOW() - INTERVAL '280 days'),
('00000000-0000-0000-0000-000000000006', 'Maya Soundwave', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400', 'Multi-genre DJ with a passion for bass music. Performs at clubs and festivals globally.', ARRAY['Bass', 'Dubstep', 'Trap'], 'Canada', 'active', true, NOW() - INTERVAL '260 days'),
('00000000-0000-0000-0000-000000000007', 'DJ Nova', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Future house producer and DJ. Known for melodic drops and energetic performances.', ARRAY['Future House', 'Progressive House', 'EDM'], 'Australia', 'active', true, NOW() - INTERVAL '240 days'),
('00000000-0000-0000-0000-000000000008', 'Zara Beats', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 'Deep house and nu-disco specialist. Creates smooth, groovy vibes on the dancefloor.', ARRAY['Deep House', 'Nu-Disco', 'House'], 'France', 'active', true, NOW() - INTERVAL '220 days'),

-- DJ 9-16: Hip-Hop, R&B, and Urban
('00000000-0000-0000-0000-000000000009', 'DJ Flex', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Hip-hop DJ with 20 years in the game. Master of turntablism and scratching.', ARRAY['Hip-Hop', 'R&B', 'Trap'], 'United States', 'active', true, NOW() - INTERVAL '200 days'),
('00000000-0000-0000-0000-000000000010', 'Raven Mix', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 'R&B and soul specialist. Known for smooth transitions and classic throwbacks.', ARRAY['R&B', 'Soul', 'Hip-Hop'], 'United States', 'active', true, NOW() - INTERVAL '180 days'),
('00000000-0000-0000-0000-000000000011', 'DJ Titan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Urban music DJ and producer. Blends hip-hop, trap, and electronic elements.', ARRAY['Hip-Hop', 'Trap', 'Electronic'], 'United Kingdom', 'active', true, NOW() - INTERVAL '160 days'),
('00000000-0000-0000-0000-000000000012', 'Sasha Groove', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'Female DJ specializing in R&B and neo-soul. Creates intimate, soulful atmospheres.', ARRAY['R&B', 'Neo-Soul', 'Hip-Hop'], 'United States', 'active', true, NOW() - INTERVAL '140 days'),

-- DJ 13-16: Latin & World Music
('00000000-0000-0000-0000-000000000013', 'DJ Caliente', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Latin music specialist. Brings reggaeton, salsa, and bachata to the dancefloor.', ARRAY['Reggaeton', 'Latin', 'Salsa'], 'Colombia', 'active', true, NOW() - INTERVAL '120 days'),
('00000000-0000-0000-0000-000000000014', 'Isabella Rhythm', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400', 'World music DJ. Blends African, Latin, and Caribbean sounds for unique sets.', ARRAY['World Music', 'Afrobeat', 'Latin'], 'Brazil', 'active', true, NOW() - INTERVAL '100 days'),
('00000000-0000-0000-0000-000000000015', 'DJ Sol', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Tropical house and Latin fusion DJ. Known for beach party vibes and summer anthems.', ARRAY['Tropical House', 'Latin', 'Reggaeton'], 'Mexico', 'active', true, NOW() - INTERVAL '80 days'),
('00000000-0000-0000-0000-000000000016', 'Carmen Fuego', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', 'Flamenco and electronic fusion artist. Creates unique Spanish-influenced dance music.', ARRAY['Flamenco', 'Electronic', 'World Music'], 'Spain', 'active', true, NOW() - INTERVAL '60 days'),

-- DJ 17-20: Asian & K-Pop
('00000000-0000-0000-0000-000000000017', 'DJ K-Pop Star', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'K-Pop and J-Pop remix specialist. Popular in Asian nightlife scenes.', ARRAY['K-Pop', 'J-Pop', 'Electronic'], 'South Korea', 'active', true, NOW() - INTERVAL '40 days'),
('00000000-0000-0000-0000-000000000018', 'Yuki Beats', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 'Japanese DJ known for anime remixes and J-Pop fusion. High-energy performances.', ARRAY['J-Pop', 'Anime', 'Electronic'], 'Japan', 'active', true, NOW() - INTERVAL '35 days'),
('00000000-0000-0000-0000-000000000019', 'DJ Dragon', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Chinese DJ blending traditional and modern electronic sounds.', ARRAY['Electronic', 'Chinese Pop', 'EDM'], 'China', 'active', true, NOW() - INTERVAL '30 days'),
('00000000-0000-0000-0000-000000000020', 'Maya Asian Vibes', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400', 'Southeast Asian music specialist. Mixes Thai, Vietnamese, and regional pop hits.', ARRAY['Asian Pop', 'Electronic', 'World Music'], 'Thailand', 'active', true, NOW() - INTERVAL '25 days'),

-- DJ 21-24: Open Format & Multi-Genre
('00000000-0000-0000-0000-000000000021', 'DJ Versatile', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'Open format DJ who plays everything. Adapts to any crowd and venue.', ARRAY['Open Format', 'Top 40', 'Hip-Hop'], 'United States', 'active', true, NOW() - INTERVAL '20 days'),
('00000000-0000-0000-0000-000000000022', 'Max Mixmaster', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'Wedding and event DJ with 10+ years experience. Keeps the party going all night.', ARRAY['Open Format', 'Top 40', 'Dance'], 'United States', 'active', true, NOW() - INTERVAL '15 days'),
('00000000-0000-0000-0000-000000000023', 'DJ Fusion', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 'Multi-genre DJ blending rock, pop, and electronic. Known for creative mashups.', ARRAY['Rock', 'Pop', 'Electronic'], 'United Kingdom', 'active', true, NOW() - INTERVAL '10 days'),
('00000000-0000-0000-0000-000000000024', 'Aria All-Genre', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400', 'Versatile DJ who reads the crowd perfectly. Plays the right music at the right time.', ARRAY['Open Format', 'House', 'Hip-Hop'], 'Canada', 'active', true, NOW() - INTERVAL '5 days');

-- Re-enable RLS
ALTER TABLE djs ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Note: The foreign key constraint is intentionally left disabled
-- If you want to re-enable it, you'll need to either:
-- 1. Create corresponding users in auth.users with matching UUIDs
-- 2. Update the user_id values to match existing user UUIDs
-- 3. Or keep it disabled if you're using this for testing/development

-- Verify insertion
SELECT 
  COUNT(*) AS total_djs,
  COUNT(DISTINCT country) AS countries,
  COUNT(DISTINCT genres) AS unique_genre_combinations
FROM djs
WHERE is_active = TRUE AND status = 'active';

-- Show all inserted DJs
SELECT 
  id,
  name,
  country,
  genres,
  created_at
FROM djs
WHERE user_id::text LIKE '00000000-%'
ORDER BY created_at DESC;

-- ============================================================================
-- Script completed
-- ============================================================================

