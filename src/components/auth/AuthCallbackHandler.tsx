"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function AuthCallbackHandler() {
  const router = useRouter();
  const { currentUser, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && currentUser) {
      // Get redirect URL from sessionStorage
      const redirect = sessionStorage.getItem("auth_redirect");
      if (redirect) {
        sessionStorage.removeItem("auth_redirect");
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [currentUser, isInitialized, router]);

  return null;
}

