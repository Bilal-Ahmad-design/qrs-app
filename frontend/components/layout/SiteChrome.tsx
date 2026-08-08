import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface SiteChromeProps {
  children: ReactNode;
}

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <>
      <div className="w-full bg-status-warn/20 border-b border-status-warn text-center py-3 px-6 sticky top-0 z-50">
        <p className="text-sm font-semibold text-status-warn">
          MODELED — MODEL CARD v0 (DRAFT) · NOT INDEPENDENTLY VALIDATED
        </p>
      </div>
      <Header />
      <main className="bg-cream-50">{children}</main>
      <Footer />
    </>
  );
}
