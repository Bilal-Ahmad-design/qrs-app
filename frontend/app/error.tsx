'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 mb-4">
          500
        </h1>
        <h2 className="text-3xl font-bold text-white mb-4">Something Went Wrong</h2>
        <p className="text-lg text-slate-300 mb-8 max-w-md">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
