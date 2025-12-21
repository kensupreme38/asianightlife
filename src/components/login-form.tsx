"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams()
  const redirect = searchParams?.get("redirect") || "/"
  const locale = useLocale()
  const supabase = createClient()
  
  const handleLogin = async () => {
    // Store redirect URL and locale in sessionStorage to retrieve after auth callback
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_redirect", redirect)
      sessionStorage.setItem("auth_locale", locale)
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error logging in:', error.message)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={handleLogin}>
                  <Image alt="GoogleIcon" src={'https://img.icons8.com/?size=96&id=V5cGWnc9R4xj&format=png'} width={20} height={20}></Image>
                  Login with Google
                </Button>
              </Field>
              
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  )
}
