'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentContextType {
  consent: ConsentState;
  setConsent: (consent: ConsentState) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  preferencesOpen: boolean;
  hasConsented: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(
  undefined,
);

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consent, setConsentState] = useState<ConsentState>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for existing consent
    const stored = localStorage.getItem('cookie-consent');
    if (stored) {
      setConsentState(JSON.parse(stored));
      setHasConsented(true);
    } else {
      // Check for GPC signal (Global Privacy Control)
      if ('globalPrivacyControl' in navigator) {
        const gpcSignal =
          (navigator as any).globalPrivacyControl === true;
        if (gpcSignal) {
          // GPC is opt-out signal; respect it without showing banner
          const gpcConsent: ConsentState = {
            essential: true,
            analytics: false,
            marketing: false,
          };
          setConsentState(gpcConsent);
          localStorage.setItem('cookie-consent', JSON.stringify(gpcConsent));
          setHasConsented(true);
        }
      }
    }
  }, []);

  const handleSetConsent = (newConsent: ConsentState) => {
    setConsentState(newConsent);
    localStorage.setItem('cookie-consent', JSON.stringify(newConsent));
    setHasConsented(true);
  };

  if (!mounted) return <>{children}</>;

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        setConsent: handleSetConsent,
        openPreferences: () => setPreferencesOpen(true),
        closePreferences: () => setPreferencesOpen(false),
        preferencesOpen,
        hasConsented,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      'useCookieConsent must be used within CookieConsentProvider',
    );
  }
  return context;
}
