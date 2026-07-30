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
    <form onSubmit={handleSubmit} className="rounded-lg border border-teal-700/20 bg-white p-8">
      <h2 className="mb-4 text-2xl font-semibold text-ink-900">Send a request</h2>
      <p className="mb-6 text-sm text-text-muted">
        This form stores your request in a server-side audit log for review.
      </p>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-ink-800">
          Name
          <input
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            className="mt-2 w-full rounded-md border border-cream-100 px-4 py-3"
            placeholder="Your name"
          />
        </label>
        <label className="block text-sm font-medium text-ink-800">
          Email
          <input
            type="email"
            required
            value={formState.email}
            onChange={(event) => setFormState({ ...formState, email: event.target.value })}
            className="mt-2 w-full rounded-md border border-cream-100 px-4 py-3"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm font-medium text-ink-800">
          Message
          <textarea
            required
            value={formState.message}
            onChange={(event) => setFormState({ ...formState, message: event.target.value })}
            className="mt-2 min-h-32 w-full rounded-md border border-cream-100 px-4 py-3"
            placeholder="Describe your issue or question"
          />
        </label>
      </div>
      {message ? (
        <p className={`mt-4 text-sm ${status === 'success' ? 'text-teal-600' : 'text-rose-600'}`}>
          {message}
        </p>
      ) : null}
      {turnstileEnabled ? <div id="support-turnstile" className="mt-6" /> : null}
      <button
        type="submit"
        className="mt-6 rounded-md bg-teal-500 px-6 py-3 font-semibold text-ink-900 transition hover:bg-teal-600"
      >
        Submit request
      </button>
    </form>
  );
}
