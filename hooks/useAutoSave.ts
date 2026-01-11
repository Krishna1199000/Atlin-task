'use client'

import { useEffect, useRef, useState, useMemo } from 'react'

export function useAutoSave<T extends Record<string, any>>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay: number = 2000
) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<T>(data)
  const onSaveRef = useRef(onSave)

  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  const dataString = useMemo(() => JSON.stringify(data), [data])

  useEffect(() => {
    const previousString = JSON.stringify(previousDataRef.current)
    if (dataString === previousString) {
      return
    }

    setHasUnsavedChanges(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await onSaveRef.current(data)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        previousDataRef.current = data
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auto-save failed:', error)
        }
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [dataString, delay])

  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsSaving(true)
    try {
      await onSaveRef.current(data)
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      previousDataRef.current = data
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Manual save failed:', error)
      }
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
  }
}