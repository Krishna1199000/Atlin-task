import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'
import { Suspense } from 'react'
import { AuthFormSkeleton } from '@/components/ui/Skeleton'

export default async function SignupPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/notes')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900">
            Private Notes Vault
          </h1>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Create your account
          </p>
        </div>
        <Suspense fallback={<AuthFormSkeleton />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  )
}