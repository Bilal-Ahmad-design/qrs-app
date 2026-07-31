'use client';

import { useEffect, useState } from 'react';
import { useCookieConsent } from './CookieConsentProvider';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const {
    consent,
    setConsent,
    openPreferences,
    closePreferences,
    preferencesOpen,
    hasConsented,
  } = useCookieConsent();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || (hasConsented && !preferencesOpen)) return null;

  const handleAcceptAll = () => {
    setConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
    closePreferences();
  };

  const handleRejectNonEssential = () => {
    setConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
    closePreferences();
  };

  return (
    <>
      {/* Banner (shown only on first visit) */}
      {!hasConsented && (
        <div className="fixed bottom-0 left-0 right-0 bg-ink-800 border-t border-teal-700 p-space-6 z-50">
          <div className="max-w-screen-xl mx-auto">
            <p className="text-body text-white mb-space-4">
              We use cookies to enhance your experience. By continuing to browse,
              you consent to our use of cookies.{' '}
              <a href="/cookies/" className="text-teal-500 hover:text-teal-600 underline">
                Learn more
              </a>
            </p>
            <div className="flex gap-space-3 flex-wrap">
              <Button variant="primary" onClick={handleAcceptAll}>
                Accept All
              </Button>
              <Button variant="secondary" onClick={handleRejectNonEssential}>
                Reject Non-Essential
              </Button>
              <Button variant="tertiary" onClick={openPreferences}>
                Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {preferencesOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-space-4">
          <div className="bg-ink-800 border border-teal-700 rounded-md max-w-md w-full p-space-6">
            <div className="flex justify-between items-start mb-space-4">
              <h2 className="font-display text-h3 text-white">
                Cookie Preferences
              </h2>
              <button
                onClick={closePreferences}
                className="text-teal-500 hover:text-teal-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-space-4 mb-space-6">
              {/* Essential (always on) */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="essential"
                  checked={true}
                  disabled
                  className="w-4 h-4"
                />
                <label htmlFor="essential" className="ml-space-3 text-white">
                  <span className="font-semibold block">Essential Cookies</span>
                  <span className="text-small text-teal-700">
                    Always enabled for security
                  </span>
                </label>
              </div>

              {/* Analytics */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({
                      ...consent,
                      analytics: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="analytics" className="ml-space-3 text-white">
                  <span className="font-semibold block">Analytics</span>
                  <span className="text-small text-teal-700">
                    Help us improve your experience
                  </span>
                </label>
              </div>

              {/* Marketing */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="marketing"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({
                      ...consent,
                      marketing: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="marketing" className="ml-space-3 text-white">
                  <span className="font-semibold block">Marketing</span>
                  <span className="text-small text-teal-700">
                    Personalized content and offers
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-space-3">
              <Button
                variant="primary"
                onClick={() => {
                  closePreferences();
                  if (!hasConsented) setConsent(consent);
                }}
              >
                Save Preferences
              </Button>
              <Button variant="secondary" onClick={handleRejectNonEssential}>
                Reject All
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
