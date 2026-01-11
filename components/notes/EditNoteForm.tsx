'use client'

import { useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Note } from '@/types/database.types'
import { useAutoSave } from '@/hooks/useAutoSave'
import { format } from 'date-fns'
import { VALIDATION, AUTO_SAVE_DELAY } from '@/lib/constants'

interface EditNoteFormProps {
  note: Note
}

export default function EditNoteForm({ note }: EditNoteFormProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const isValid = useMemo(() => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    return (
      trimmedTitle.length >= VALIDATION.MIN_TITLE_LENGTH &&
      trimmedTitle.length <= VALIDATION.MAX_TITLE_LENGTH &&
      trimmedContent.length >= VALIDATION.MIN_CONTENT_LENGTH &&
      trimmedTitle.length > 0 &&
      trimmedContent.length > 0
    )
  }, [title, content])

  const handleAutoSave = useCallback(
    async (data: { title: string; content: string }) => {
      const trimmedTitle = data.title.trim()
      const trimmedContent = data.content.trim()

      if (!trimmedTitle || !trimmedContent) {
        return
      }

      if (
        trimmedTitle.length < VALIDATION.MIN_TITLE_LENGTH ||
        trimmedContent.length < VALIDATION.MIN_CONTENT_LENGTH
      ) {
        return
      }

      const { error: updateError } = await supabase
        .from('notes')
        .update({
          title: trimmedTitle,
          content: trimmedContent,
        })
        .eq('id', note.id)

      if (updateError) {
        throw updateError
      }
    },
    [note.id, supabase]
  )

  const { isSaving, lastSaved, hasUnsavedChanges, saveNow } = useAutoSave(
    { title, content },
    handleAutoSave,
    AUTO_SAVE_DELAY
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!isValid) {
      if (!trimmedTitle) {
        setError('Title is required')
      } else if (trimmedTitle.length < VALIDATION.MIN_TITLE_LENGTH) {
        setError(`Title must be at least ${VALIDATION.MIN_TITLE_LENGTH} characters long`)
      } else if (!trimmedContent) {
        setError('Content is required')
      } else {
        setError(`Content must be at least ${VALIDATION.MIN_CONTENT_LENGTH} characters long`)
      }
      return
    }

    setLoading(true)

    try {
      await saveNow()
      toast.success('Note saved successfully!')
      router.push(`/notes/${note.id}`)
      router.refresh()
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update note'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm animate-fadeIn">
      <div className="mb-4 pb-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {isSaving ? (
            <>
              <svg
                className="animate-spin h-3 w-3 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-blue-600">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <svg
                className="h-3 w-3 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-green-600">
                Saved {format(lastSaved, 'h:mm a')}
              </span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <div className="h-2 w-2 rounded-full bg-yellow-500" aria-hidden="true" />
              <span className="text-yellow-600">Unsaved changes</span>
            </>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-2">
            Title <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Enter note title..."
            autoFocus
            disabled={loading}
            maxLength={VALIDATION.MAX_TITLE_LENGTH}
            aria-required="true"
          />
          <p className="mt-1 text-xs text-gray-500">
            {title.length}/{VALIDATION.MAX_TITLE_LENGTH} characters
          </p>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-800 mb-2">
            Content <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none transition-all duration-200 text-gray-900 placeholder-gray-500"
            placeholder="Write your note here..."
            disabled={loading}
            aria-required="true"
          />
          <p className="mt-1 text-xs text-gray-500">
            {content.length} characters
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-start gap-2 animate-slideIn" role="alert">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-3 border-t border-gray-200">
          <Link
            href={`/notes/${note.id}`}
            className="text-center sm:text-left text-gray-700 hover:text-gray-900 focus:outline-none text-sm sm:text-base py-2 sm:py-0 transition-colors duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-6 py-2.5 text-sm sm:text-base bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}