'use client';

import { useEffect, useState } from 'react';
import { useCookieConsent } from '@/components/cookie-consent/CookieConsentProvider';

export function CookiePreferencesButton() {
  const [mounted, setMounted] = useState(false);
  const { openPreferences } = useCookieConsent();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={openPreferences}
      className="text-small text-teal-500 hover:text-teal-600 underline"
    >
      Cookie Preferences
    </button>
  );
}
