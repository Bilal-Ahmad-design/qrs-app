'use client';

import { useEffect, useState } from 'react';
import { TURNSTILE_SITE_KEY, isTurnstileConfigured } from '@/lib/turnstile';

export function SupportForm() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileEnabled = isTurnstileConfigured();

  useEffect(() => {
    if (!turnstileEnabled || typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    const widget = window as typeof window & { turnstile?: { render: (container: string, options: Record<string, unknown>) => string } };
    const renderWidget = () => {
      if (!widget.turnstile) return;
      widget.turnstile.render('#support-turnstile', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
      });
    };

    if (widget.turnstile) {
      renderWidget();
    } else {
      script.onload = renderWidget;
    }

    return () => {
      script.remove();
    };
  }, [turnstileEnabled]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');
    setMessage('');

    if (turnstileEnabled && !turnstileToken) {
      setStatus('error');
      setMessage('Please complete the security check before submitting.');
      return;
    }

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formState, turnstileToken }),
    });

    const result = await response.json();

    if (result.success) {
      setStatus('success');
      setMessage('Thanks — your request has been recorded for review.');
      setFormState({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
      setMessage(result.error || 'Unable to submit your request right now.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-between rounded-2xl border border-teal-700/10 bg-gradient-to-br from-light-bg-primary to-white p-8 sm:p-12 shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-teal-100">
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <h2 className="mb-2 text-3xl font-bold text-ink-900">Send a Request</h2>
        <p className="mb-8 text-light-text-secondary">
          We'll review your request and respond as soon as possible.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Name <span className="text-teal-600">*</span>
            </label>
            <input
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
              className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-ink-900 placeholder-text-muted transition focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Email <span className="text-teal-600">*</span>
            </label>
            <input
              type="email"
              required
              value={formState.email}
              onChange={(event) => setFormState({ ...formState, email: event.target.value })}
              className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-ink-900 placeholder-text-muted transition focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-800 mb-2">
              Message <span className="text-teal-600">*</span>
            </label>
            <textarea
              required
              value={formState.message}
              onChange={(event) => setFormState({ ...formState, message: event.target.value })}
              className="w-full rounded-lg border border-cream-200 bg-white px-4 py-3 text-ink-900 placeholder-text-muted transition focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 min-h-32 resize-none"
              placeholder="Describe your issue, question, or request..."
            />
          </div>
        </div>

        {message ? (
          <div className={`mt-6 p-4 rounded-lg ${status === 'success' ? 'bg-teal-50 border border-teal-200' : 'bg-rose-50 border border-rose-200'}`}>
            <p className={`text-sm font-medium ${status === 'success' ? 'text-teal-800' : 'text-rose-800'}`}>
              {message}
            </p>
          </div>
        ) : null}

        {turnstileEnabled ? (
          <div id="support-turnstile" className="mt-6 flex justify-center" />
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 font-semibold text-white transition hover:from-teal-700 hover:to-teal-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
      >
        Submit Request
      </button>
    </form>
  );
}
