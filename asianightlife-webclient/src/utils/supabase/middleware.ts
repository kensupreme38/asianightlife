import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  loginPathForLocale,
  sanitizeAuthRedirect,
  splitLocalePath,
} from "@/lib/auth-redirect";
import { routing } from "@/i18n/routing";

const DEFAULT_LOCALE = routing.defaultLocale;

function redirectToLogin(request: NextRequest, pathname: string) {
  const { locale, pathWithoutLocale } = splitLocalePath(pathname);
  const url = request.nextUrl.clone();
  url.pathname = loginPathForLocale(locale);
  url.searchParams.set("redirect", sanitizeAuthRedirect(pathWithoutLocale));
  return NextResponse.redirect(url);
}

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
  const { pathWithoutLocale } = splitLocalePath(pathname);

  // Các route public (không yêu cầu đăng nhập)
  const publicRoutes = ["/", "/login", "/auth", "/error"];

  // Regex cho route động: /venue/[id] (with or without locale)
  const isVenuePage = pathWithoutLocale.startsWith("/venue/");

  // DJ routes - cho phép xem công khai, chỉ yêu cầu login cho profile management
  const isDJProfilePage = pathWithoutLocale.startsWith("/dj/profile/");
  const isDJViewPage =
    pathWithoutLocale === "/dj" ||
    (pathWithoutLocale.startsWith("/dj/") && !isDJProfilePage);

  // Nếu route là public, /venue/[id], hoặc DJ view pages thì cho qua
  if (publicRoutes.includes(pathWithoutLocale) || isVenuePage || isDJViewPage) {
    return supabaseResponse;
  }

  // Legacy/invalid employee login URL → login (guests) or /employee (signed in)
  if (
    pathWithoutLocale === "/employee/login" ||
    pathWithoutLocale.startsWith("/employee/login/")
  ) {
    if (!user) {
      return redirectToLogin(request, pathname);
    }
    const { locale } = splitLocalePath(pathname);
    const url = request.nextUrl.clone();
    url.pathname = locale === DEFAULT_LOCALE ? "/employee" : `/${locale}/employee`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Nếu route là DJ profile management (create/edit) => cần login
  if (isDJProfilePage && !user) {
    return redirectToLogin(request, pathname);
  }

  // Employee routes - yêu cầu đăng nhập
  const isEmployeeRoute =
    pathWithoutLocale === "/employee" || pathWithoutLocale.startsWith("/employee/");
  if (isEmployeeRoute && !user) {
    return redirectToLogin(request, pathname);
  }

  return supabaseResponse;
}
