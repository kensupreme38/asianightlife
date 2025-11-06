import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Image from "next/image"
import { LogoImage } from "@/components/logo-image"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex items-center justify-center rounded-md">
              <LogoImage
                width={32}
                height={32}
                className="object-cover rounded-lg"
                loading="lazy"
              />
          </div>
          AsiaNightLife
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
