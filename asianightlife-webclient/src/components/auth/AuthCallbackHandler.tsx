"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { sanitizeAuthRedirect, splitLocalePath } from "@/lib/auth-redirect";

export function AuthCallbackHandler() {
  const router = useRouter();
  const { currentUser, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && currentUser) {
      // Get redirect URL and locale from sessionStorage
      let redirect = sanitizeAuthRedirect(
        sessionStorage.getItem("auth_redirect") || "/"
      );
      const locale = sessionStorage.getItem("auth_locale") || "en";
      
      // Remove locale prefix from redirect URL if present (e.g., /en/login -> /login)
      const { pathWithoutLocale } = splitLocalePath(
        redirect.startsWith("/") ? redirect : `/${redirect}`
      );
      redirect = pathWithoutLocale;
      
      // Clean up sessionStorage
      sessionStorage.removeItem("auth_redirect");
      sessionStorage.removeItem("auth_locale");
      
      // Construct locale-prefixed URL manually since we're outside the [locale] structure
      const localePrefixedUrl = redirect === '/' ? `/${locale}` : `/${locale}${redirect}`;
      router.push(localePrefixedUrl);
    }
  }, [currentUser, isInitialized, router]);

  return null;
}

