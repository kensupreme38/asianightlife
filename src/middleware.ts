import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for sitemap.xml and robots.txt
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }
  
  // Skip locale prefixing for /auth routes (OAuth callbacks don't need locale)
  if (pathname.startsWith('/auth')) {
    const supabaseResponse = await updateSession(request);
    return supabaseResponse;
  }
  
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
     * - sitemap.xml (sitemap file)
     * - robots.txt (robots file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
