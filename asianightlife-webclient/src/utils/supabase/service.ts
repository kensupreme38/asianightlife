import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
}

function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
}

/**
 * Server-only client that bypasses RLS. Use for public venue reads in Route Handlers
 * when a service role key is set (same Supabase project as admin).
 */
export function createServiceRoleClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Anonymous client without cookies — reliable in Route Handlers for public `SELECT`.
 * Pair with RLS policy "read active venues" on `public.venues`, or use service role above.
 */
export function createPublicAnonClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
