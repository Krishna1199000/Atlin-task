'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

interface DeleteNoteButtonProps {
  noteId: string
}

export default function DeleteNoteButton({ noteId }: DeleteNoteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleDelete = async (e: React.MouseEvent) => {
    // Prevent navigation when clicking delete button
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from('notes').delete().eq('id', noteId)

      if (error) throw error

      toast.error('Note deleted successfully')

      // If we're on the note detail page, redirect to notes list
      if (pathname?.includes(`/notes/${noteId}`)) {
        router.push('/notes')
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 focus:outline-none disabled:opacity-50 transition-colors p-1 sm:p-2"
      title="Delete note"
      aria-label="Delete note"
    >
      {loading ? (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
    </button>
  )
}