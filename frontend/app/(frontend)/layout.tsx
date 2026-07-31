import type { Metadata } from 'next';
import { Outfit, Poppins, JetBrains_Mono } from 'next/font/google';
import { buildMetadata } from '@/lib/metadata';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { CookieConsentProvider } from '@/components/cookie-consent/CookieConsentProvider';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-outfit',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-poppins',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = buildMetadata({
  title: 'QRS — Quantitative Risk Systems',
  description: 'Palantir-grade quantitative software for institutional risk assessment.',
  path: '/',
});

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${poppins.variable} ${jetbrainsMono.variable}`}
    >
      {/* suppressHydrationWarning suppresses browser extension attribute mismatches (e.g., cz-shortcut-listen) */}
      <body className="font-body bg-cream-50 text-text-strong" suppressHydrationWarning>
        <CookieConsentProvider>
          <SiteChrome>{children}</SiteChrome>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
