'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { VALIDATION } from '@/lib/constants'

export default function NewNoteForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('You must be logged in to create a note')
      }

      const { error: insertError } = await supabase.from('notes').insert({
        title: trimmedTitle,
        content: trimmedContent,
        user_id: user.id,
      })

      if (insertError) throw insertError

      toast.success('Note created successfully!')
      router.push('/notes')
      router.refresh()
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create note'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm animate-fadeIn">
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
            href="/notes"
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : (
              'Create Note'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}