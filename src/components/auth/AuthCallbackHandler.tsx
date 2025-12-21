"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthCallbackHandler() {
  const router = useRouter();
  const { currentUser, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && currentUser) {
      // Get redirect URL and locale from sessionStorage
      let redirect = sessionStorage.getItem("auth_redirect") || "/";
      const locale = sessionStorage.getItem("auth_locale") || "en";
      
      // Remove locale prefix from redirect URL if present (e.g., /en/login -> /login)
      const locales = ['en', 'vi', 'zh', 'id', 'ja', 'ko', 'ru', 'th'];
      for (const loc of locales) {
        if (redirect.startsWith(`/${loc}/`)) {
          redirect = redirect.slice(`/${loc}`.length);
          break;
        } else if (redirect === `/${loc}`) {
          redirect = '/';
          break;
        }
      }
      
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

