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
    return updateSession(request);
  }

  // Handle i18n routing first
  const intlResponse = intlMiddleware(request);

  // If intl middleware returns a redirect (307/308), use it immediately
  if (intlResponse && (intlResponse.status === 307 || intlResponse.status === 308)) {
    return intlResponse;
  }

  // If intl middleware rewrote the URL (e.g. / -> /en internally),
  // we must run Supabase auth on the rewritten request, not the original.
  // Copy intl rewrite headers into the Supabase response.
  const supabaseResponse = await updateSession(request);

  // Propagate intl headers (rewrite, locale, etc.) onto the Supabase response
  if (intlResponse) {
    intlResponse.headers.forEach((value, key) => {
      supabaseResponse.headers.set(key, value);
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
