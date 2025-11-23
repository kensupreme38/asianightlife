import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First handle i18n routing - this handles locale detection and redirects
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware returns a redirect (307 or 308), use it immediately
  if (intlResponse && (intlResponse.status === 307 || intlResponse.status === 308)) {
    return intlResponse;
  }
  
  // Then handle Supabase session on the locale-prefixed path
  // Only if intl didn't redirect
  const supabaseResponse = await updateSession(request);
  
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
