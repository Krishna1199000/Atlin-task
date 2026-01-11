import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Auth Callback Handler
 * 
 * Handles both OAuth callbacks (Google) and email confirmation links.
 * 
 * Flow:
 * 1. OAuth (Google): Uses 'code' parameter, exchanges for session
 * 2. Email confirmation: Uses 'token_hash' and 'type' parameters, verifies OTP
 * 
 * This is the entry point after users click confirmation links in their email
 * or return from OAuth providers.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/notes'

  const supabase = await createClient()

  // Handle OAuth callback (Google) - uses 'code' parameter
  if (code && !token_hash) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // OAuth session created successfully
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Handle email confirmation - uses 'token_hash' and 'type' parameters
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Email verified and session created
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If we get here, authentication failed
  // Redirect to login with error message
  return NextResponse.redirect(`${origin}/login?error=Authentication failed. Please try again.`)
}