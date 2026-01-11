'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface CheckEmailScreenProps {
  email: string
}

/**
 * CheckEmailScreen Component
 * 
 * UX Decision: After email signup, Supabase requires email confirmation.
 * Instead of redirecting to login (which causes "Email not confirmed" errors),
 * we show a dedicated screen that:
 * 1. Clearly explains what happened
 * 2. Shows the email address they used
 * 3. Provides resend functionality
 * 4. Allows them to go back and change email if needed
 * 
 * This follows production UX standards where users should never see
 * confusing error states after a successful action.
 */
export default function CheckEmailScreen({ email }: CheckEmailScreenProps) {
  const [resending, setResending] = useState(false)
  const supabase = createClient()

  const handleResendEmail = async () => {
    setResending(true)
    try {
      // Resend confirmation email using the same email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast.success('Confirmation email sent! Please check your inbox.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-sm rounded-lg border border-gray-200 text-center w-full">
      {/* Email Icon */}
      <div className="mx-auto flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-green-100 mb-4 sm:mb-6">
        <svg
          className="h-6 w-6 sm:h-8 sm:w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
        Check your email
      </h2>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
        We've sent a confirmation link to
      </p>
      <p className="text-sm sm:text-base text-gray-900 font-medium mb-4 sm:mb-6 break-all px-2">
        {email}
      </p>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-2">
        Click the link in the email to verify your account and start using Private Notes Vault.
      </p>

      {/* Resend Button */}
      <div className="space-y-3 sm:space-y-4">
        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="w-full px-4 py-2.5 sm:py-2 text-sm sm:text-base font-medium text-gray-800 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {resending ? 'Sending...' : 'Resend confirmation email'}
        </button>

        {/* Back to Signup */}
        <Link
          href="/signup"
          className="block text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
        >
          ← Back to sign up
        </Link>
      </div>

      {/* Help Text */}
      <p className="mt-5 sm:mt-6 text-xs text-gray-600 px-2">
        Didn't receive the email? Check your spam folder or try resending.
      </p>
    </div>
  )
}