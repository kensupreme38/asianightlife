"use client";
import { useState } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
            {logoError ? (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs object-cover rounded-lg" style={{ width: 32, height: 32 }}>
                ANL
              </div>
            ) : (
              <Image
                src="/logo.jpg"
                alt="Asia Night Life Logo"
                width={32}
                height={32}
                className="object-cover rounded-lg"
                onError={() => setLogoError(true)}
                loading="lazy"
                unoptimized
              />
            )}
          </div>
          AsiaNightLife
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
