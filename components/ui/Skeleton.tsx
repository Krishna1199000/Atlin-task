export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    />
  )
}

export function NoteCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 sm:h-6 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-5 w-5 flex-shrink-0 rounded" />
      </div>
    </div>
  )
}

export function NoteDetailSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
      <Skeleton className="h-7 sm:h-8 w-2/3 mb-4" />
      <Skeleton className="h-4 w-1/4 mb-6" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-full mb-3" />
      <Skeleton className="h-4 w-5/6 mb-3" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <Skeleton className="h-4 w-16 mb-4" />
      <Skeleton className="h-10 w-full mb-6" />
      <Skeleton className="h-4 w-20 mb-4" />
      <Skeleton className="h-48 w-full mb-6" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

export function AuthFormSkeleton() {
  return (
    <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
      <Skeleton className="h-4 w-24 mb-6" />
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-4 w-20 mb-6" />
      <Skeleton className="h-10 w-full mb-6" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}