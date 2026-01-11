'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Note } from '@/types/database.types'
import DeleteNoteButton from './DeleteNoteButton'
import { useState, useMemo } from 'react'
import SearchNotes from './SearchNotes'

interface NotesListProps {
  notes: Note[]
}

export default function NotesList({ notes }: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes
    }

    const query = searchQuery.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 animate-fadeIn">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-800 text-base sm:text-lg mb-4 font-medium">No notes yet</p>
        <Link
          href="/notes/new"
          className="inline-block text-gray-900 hover:text-gray-700 underline text-sm sm:text-base transition-colors font-medium"
        >
          Create your first note
        </Link>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <SearchNotes onSearch={setSearchQuery} />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <p className="text-sm text-gray-600 mb-4">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note found' : 'notes found'}
        </p>
      )}

      {/* No Results */}
      {searchQuery && filteredNotes.length === 0 && (
        <div className="text-center py-8 animate-fadeIn">
          <p className="text-gray-600 text-base mb-2">No notes found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sm text-gray-900 hover:text-gray-700 underline transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {filteredNotes.map((note, index) => (
            <div
              key={note.id}
              className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <Link href={`/notes/${note.id}`} className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-gray-800 line-clamp-2 break-words transition-colors">
                    {note.title}
                  </h2>
                  <p className="text-gray-700 text-sm line-clamp-2 mb-2 sm:mb-3 break-words">
                    {note.content}
                  </p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(note.created_at), 'MMM d, yyyy · h:mm a')}
                  </p>
                </Link>
                <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
                  <Link
                    href={`/notes/${note.id}/edit`}
                    className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors rounded hover:bg-gray-100"
                    title="Edit note"
                    aria-label="Edit note"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Link>
                  <DeleteNoteButton noteId={note.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}