import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { NAV_LINKS } from '@/lib/constants';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink-800 border-b border-teal-700">
      <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <img
            src="/qrs-wordmark.webp"
            alt="QRS - Quantitative Risk Systems"
            className="w-20 sm:w-28 h-auto"
          />
        </Link>

        <div className="hidden md:flex gap-6 lg:gap-8 items-center flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm lg:text-body text-white hover:text-teal-500 transition-colors duration-base whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          <Button variant="primary" className="hidden sm:inline-block text-sm sm:text-base">Request Demo</Button>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
