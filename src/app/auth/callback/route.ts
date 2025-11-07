import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error)
        return NextResponse.redirect(`${origin}/signin?error=auth_callback_error`)
      }
      
      // Authentication successful, redirect to dashboard
      return NextResponse.redirect(`${origin}/`)
    } catch (error) {
      console.error('Unexpected error during auth callback:', error)
      return NextResponse.redirect(`${origin}/signin?error=unexpected_error`)
    }
  }

  // No code present, redirect to signin with error
  return NextResponse.redirect(`${origin}/signin?error=no_code`)
}