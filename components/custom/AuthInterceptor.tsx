"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { logoutAction as developerLogout } from "@/app/actions/auth";

export function AuthInterceptor() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await originalFetch(input, init);

      if (response.status === 401) {
        // Automatic logout and redirect on auth-related issues (401)
        if (pathname.startsWith("/developer") || pathname.startsWith("/checkout")) {
          try {
            await developerLogout();
          } catch (err) {
            console.error("AuthInterceptor: Failed to perform developer logout", err);
          }
          // Redirect to developer portal login
          router.push("/login");
        } else if (pathname.startsWith("/dashboard")) {
          try {
            const { logoutAction: adminLogout } = await import("@/app/dashboard/login/actions");
            await adminLogout();
          } catch (err) {
            console.error("AuthInterceptor: Failed to perform admin logout", err);
          }
          // Redirect to legacy superuser login
          router.push("/dashboard/login");
        }
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [router, pathname]);

  return null;
}
