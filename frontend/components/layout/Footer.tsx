import Link from 'next/link';
import { COMPLIANCE_LINKS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink-900 text-cream-50 py-12">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-h4 font-semibold mb-4">Compliance</h3>
            <ul className="space-y-2">
              <li>
                <Link href={COMPLIANCE_LINKS.privacy} className="text-teal-500 hover:text-teal-600">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href={COMPLIANCE_LINKS.terms} className="text-teal-500 hover:text-teal-600">
                  Terms
                </Link>
              </li>
              <li>
                <Link href={COMPLIANCE_LINKS.cookies} className="text-teal-500 hover:text-teal-600">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-h4 font-semibold mb-4">Trust</h3>
            <ul className="space-y-2">
              <li>
                <Link href={COMPLIANCE_LINKS.security} className="text-teal-500 hover:text-teal-600">
                  Security
                </Link>
              </li>
              <li>
                <Link href={COMPLIANCE_LINKS.vdp} className="text-teal-500 hover:text-teal-600">
                  Vulnerability Disclosure
                </Link>
              </li>
              <li>
                <Link
                  href={COMPLIANCE_LINKS.subprocessors}
                  className="text-teal-500 hover:text-teal-600"
                >
                  Subprocessors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-h4 font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href={COMPLIANCE_LINKS.support} className="text-teal-500 hover:text-teal-600">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-700 pt-8">
          <p className="text-small text-text-muted-on-dark mb-2">
            &copy; {currentYear} QRS Quantum Risk Systems. All rights reserved.
          </p>
          <p className="text-small text-status-warn">SOC 2 in progress (Vanta)</p>
        </div>
      </div>
    </footer>
  );
}
