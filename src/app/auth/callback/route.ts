import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to a page that handles the redirect client-side
      // This allows us to read from sessionStorage
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      const baseUrl = isLocalEnv 
        ? origin 
        : forwardedHost 
          ? `https://${forwardedHost}` 
          : origin
      
      return NextResponse.redirect(`${baseUrl}/auth/callback/success`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}