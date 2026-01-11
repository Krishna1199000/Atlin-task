import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Legacy Email Verification Route
 * 
 * This route handles older email verification links that use token_hash.
 * Modern Supabase uses the /auth/callback route with code parameter.
 * 
 * We keep this for backward compatibility with any existing email links.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // Email verified successfully
      return NextResponse.redirect(`${origin}/notes`)
    }
  }

  // Verification failed
  return NextResponse.redirect(`${origin}/login?error=Email verification failed. Please try again.`)
}
