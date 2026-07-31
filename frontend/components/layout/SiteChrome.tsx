import type { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface SiteChromeProps {
  children: ReactNode;
}

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <>
      <Header />
      <main className="bg-cream-50">{children}</main>
      <Footer />
    </>
  );
}
