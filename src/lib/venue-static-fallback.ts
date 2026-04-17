/**
 * When `SUPABASE_SERVICE_ROLE_KEY` is set, venue APIs use only Supabase — no `data.ts` merge.
 * Without it, static fallback remains for local/offline dev unless disabled explicitly.
 */
export function isVenueStaticFallbackEnabled(): boolean {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return false;
  }
  return process.env.VENUES_ALLOW_STATIC_FALLBACK !== "false";
}

/** Client: opt-in static fallback when API returns 404 (default off). */
export function isClientVenueStaticFallbackEnabled(): boolean {
  return process.env.NEXT_PUBLIC_VENUES_STATIC_FALLBACK === "true";
}
