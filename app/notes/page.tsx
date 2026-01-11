import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NotesList from '@/components/notes/NotesList'
import LogoutButton from '@/components/auth/LogoutButton'
import { NoteCardSkeleton } from '@/components/ui/Skeleton'
import { Suspense } from 'react'

async function NotesContent() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
  }

  return <NotesList notes={notes || []} />
}

async function NotesCount() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { count } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const noteCount = count || 0
  return (
    <span className="text-gray-700">
      {noteCount} {noteCount === 1 ? 'note' : 'notes'}
    </span>
  )
}

export default async function NotesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="mt-1 text-sm text-gray-700">
                <Suspense fallback={<span className="inline-block w-20 h-4 bg-gray-200 rounded animate-pulse" />}>
                  <NotesCount />
                </Suspense>
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/notes/new"
                className="px-4 py-2 text-sm sm:text-base bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 whitespace-nowrap font-medium transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                + New Note
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Notes List with Suspense */}
        <Suspense
          fallback={
            <div className="space-y-3 sm:space-y-4">
              <NoteCardSkeleton />
              <NoteCardSkeleton />
              <NoteCardSkeleton />
            </div>
          }
        >
          <NotesContent />
        </Suspense>
      </div>
    </div>
  )
}