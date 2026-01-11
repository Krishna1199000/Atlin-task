'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import CheckEmailScreen from './CheckEmailScreen'
import { validateEmail, validatePassword, getPasswordStrength } from '@/lib/validation'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCheckEmail, setShowCheckEmail] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const passwordStrength = getPasswordStrength(password)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    
    if (value.trim()) {
      const validation = validateEmail(value)
      setEmailError(validation.isValid ? null : validation.error || null)
    } else {
      setEmailError(null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    
    if (value) {
      const validation = validatePassword(value)
      setPasswordError(validation.isValid ? null : validation.error || null)
    } else {
      setPasswordError(null)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || null)
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || null)
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      if (data.user && !data.session) {
        setShowCheckEmail(true)
        toast.success('Account created! Please check your email.')
      } else if (data.session) {
        toast.success('Account created successfully!')
        router.push('/notes')
        router.refresh()
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  if (showCheckEmail) {
    return <CheckEmailScreen email={email} />
  }

  return (
    <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-sm rounded-lg border border-gray-200 w-full animate-fadeIn">
      <form onSubmit={handleEmailSignup} className="space-y-5 sm:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleEmailChange}
            onBlur={() => {
              if (email.trim()) {
                const validation = validateEmail(email)
                setEmailError(validation.isValid ? null : validation.error || null)
              }
            }}
            className={`mt-1 block w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              emailError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
            }`}
            placeholder="you@example.com"
            disabled={loading}
          />
          {emailError && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {emailError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={handlePasswordChange}
            className={`mt-1 block w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              passwordError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500'
            }`}
            placeholder="Enter your password"
            disabled={loading}
          />
          {passwordError && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {passwordError}
            </p>
          )}
          {password && !passwordError && (
            <div className="mt-1.5 flex items-center gap-2">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  passwordStrength.strength === 'weak'
                    ? 'bg-red-500'
                    : passwordStrength.strength === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
              <span className="text-xs text-gray-600">{passwordStrength.message}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading || !!emailError || !!passwordError || !email.trim() || !password}
            className="w-full flex justify-center py-2.5 sm:py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </div>
      </form>

      <div className="mt-5 sm:mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-5 sm:mt-6">
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full inline-flex justify-center items-center py-2.5 sm:py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>
      </div>

      <p className="mt-5 sm:mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-gray-900 hover:text-gray-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}