import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  
  // Remove locale prefix for route checking (e.g., /en/login -> /login)
  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, '') || '/';

  // Các route public (không yêu cầu đăng nhập)
  const publicRoutes = ["/", "/login", "/auth", "/error"];

  // Regex cho route động: /venue/[id] (with or without locale)
  const isVenuePage = pathWithoutLocale.startsWith("/venue/");

  // DJ routes - cho phép xem công khai, chỉ yêu cầu login cho profile management
  const isDJProfilePage = pathWithoutLocale.startsWith("/dj/profile/");
  const isDJViewPage =
    pathWithoutLocale === "/dj" || (pathWithoutLocale.startsWith("/dj/") && !isDJProfilePage);

  // Nếu route là public, /venue/[id], hoặc DJ view pages thì cho qua
  if (publicRoutes.includes(pathWithoutLocale) || isVenuePage || isDJViewPage) {
    return supabaseResponse;
  }

  // Nếu route là DJ profile management (create/edit) => cần login
  if (isDJProfilePage && !user) {
    const url = request.nextUrl.clone();
    // Preserve locale in redirect
    const locale = pathname.split('/')[1] || 'en';
    url.pathname = `/${locale}/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Employee routes - yêu cầu đăng nhập
  const isEmployeeRoute =
    pathWithoutLocale === "/employee" || pathWithoutLocale.startsWith("/employee/");
  if (isEmployeeRoute && !user) {
    const url = request.nextUrl.clone();
    // Preserve locale in redirect
    const locale = pathname.split('/')[1] || 'en';
    url.pathname = `/${locale}/login`;
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
