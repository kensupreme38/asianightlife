import { createClient } from "@/utils/supabase/server";
import { createPublicAnonClient, createServiceRoleClient } from "@/utils/supabase/service";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Order: service role (same as admin, bypasses RLS) → public anon (no cookies; needs RLS policy)
 * → SSR cookie client (last resort).
 */
export async function createVenuesReader(): Promise<SupabaseClient> {
  return (
    createServiceRoleClient() ??
    createPublicAnonClient() ??
    (await createClient())
  );
}
