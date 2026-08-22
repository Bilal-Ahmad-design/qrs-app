'use client'

import { useState, useEffect, type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface SiteChromeProps {
  children: ReactNode;
}

export function SiteChrome({ children }: SiteChromeProps) {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Near top, always show banner
        setIsBannerVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, show banner
        setIsBannerVisible(true);
      } else {
        // Scrolling down, hide banner
        setIsBannerVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div className={`w-full bg-status-warn/20 border-b border-status-warn text-center py-3 px-6 sticky top-0 z-50 transition-transform duration-300 ease-in-out ${
        isBannerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
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
