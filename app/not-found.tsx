import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="text-center max-w-md w-full">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-8xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Page not found
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          href="/notes"
          className="inline-block px-6 py-3 text-sm sm:text-base bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          Go to Notes
        </Link>
      </div>
    </div>
  )
}