import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NewNoteForm from '@/components/notes/NewNoteForm'

export default async function NewNotePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          New Note
        </h1>
        <NewNoteForm />
      </div>
    </div>
  )
}