'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-cream-50">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">
          Service issue
        </p>
        <h1 className="mb-4 font-display text-h1 text-ink-800">We hit a snag</h1>
        <p className="mb-8 max-w-2xl text-body-lg text-text-muted">
          Our team has been notified. Please try again shortly, or contact support if the issue continues.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-md bg-teal-500 px-6 py-3 font-semibold text-ink-900 transition hover:bg-teal-600"
          >
            Try again
          </button>
          <a
            href="/support/"
            className="rounded-md border border-teal-700/20 px-6 py-3 font-semibold text-ink-800 transition hover:bg-white"
          >
            Contact support
          </a>
        </div>
      </div>
    </main>
  );
}
