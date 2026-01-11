import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteNoteButton from '@/components/notes/DeleteNoteButton'
import { NoteDetailSkeleton } from '@/components/ui/Skeleton'
import { Suspense } from 'react'

interface NotePageProps {
  params: Promise<{ id: string }>
}

async function NoteContent({ id }: { id: string }) {
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

  return (
    <>
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 animate-fadeIn">
        <Link
          href="/notes"
          className="text-gray-800 hover:text-gray-900 focus:outline-none text-sm sm:text-base flex items-center gap-1 font-medium transition-colors duration-200"
        >
          <span>←</span>
          <span>Back to notes</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={`/notes/${note.id}/edit`}
            className="px-3 sm:px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
          >
            Edit
          </Link>
          <DeleteNoteButton noteId={note.id} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8 shadow-sm animate-fadeIn">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">
            {note.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            {format(new Date(note.created_at), 'MMMM d, yyyy · h:mm a')}
          </p>
        </div>

        <div className="prose max-w-none">
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base sm:text-lg break-words">
            {note.content}
          </div>
        </div>
      </div>
    </>
  )
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense fallback={<NoteDetailSkeleton />}>
          <NoteContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}