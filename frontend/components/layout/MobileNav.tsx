'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center p-1 sm:p-2 text-white hover:text-teal-500 transition-colors flex-shrink-0"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-ink-800 border-b border-teal-700 md:hidden shadow-lg">
          <nav className="flex flex-col p-4 sm:p-6 gap-3 sm:gap-4 max-w-screen-xl mx-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm sm:text-body text-white hover:text-teal-500 transition-colors duration-base py-2 px-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
