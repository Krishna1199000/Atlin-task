import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditNoteForm from '@/components/notes/EditNoteForm'
import { NoteDetailSkeleton } from '@/components/ui/Skeleton'
import { Suspense } from 'react'

interface EditNotePageProps {
  params: Promise<{ id: string }>
}

async function EditNoteContent({ id }: { id: string }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: note, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !note) {
    notFound()
  }

  return <EditNoteForm note={note} />
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Edit Note
        </h1>
        <Suspense fallback={<NoteDetailSkeleton />}>
          <EditNoteContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}