export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream-50">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
          Page not found
        </p>
        <h1 className="mb-4 font-display text-h1 text-ink-800">404</h1>
        <p className="mb-8 max-w-2xl text-body-lg text-text-muted">
          The page you requested could not be found. Please return home or use the support page if you believe this is an error.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/" className="rounded-md bg-teal-500 px-6 py-3 font-semibold text-ink-900 transition hover:bg-teal-600">
            Go home
          </a>
          <a href="/support/" className="rounded-md border border-teal-700/20 px-6 py-3 font-semibold text-ink-800 transition hover:bg-white">
            Contact support
          </a>
        </div>
      </div>
    </main>
  );
}
