export const SITE_NAME = 'QRS';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://qrsrisk.com';
export const SECURITY_EMAIL = 'security@qrsrisk.com';
export const SUPPORT_EMAIL = 'support@qrsrisk.com';
export const PRIVACY_EMAIL = 'privacy@qrsrisk.com';

export const COMPLIANCE_LINKS = {
  privacy: '/privacy/',
  terms: '/terms/',
  security: '/security/',
  vdp: '/security/vdp/',
  subprocessors: '/subprocessors/',
  cookies: '/cookies/',
  support: '/support/',
};

export const NAV_LINKS = [
  { label: 'Platform', href: '/platform/' },
  { label: 'Validation', href: '/validation/' },
  { label: 'Security', href: '/security/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Support', href: '/support/' },
];
