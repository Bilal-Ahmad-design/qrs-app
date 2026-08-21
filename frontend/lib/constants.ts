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
  docs: '/docs/',
  cookies: '/cookies/',
  contact: '/contact/',
};

export const NAV_LINKS = [
  { label: 'Platform', href: '/platform/' },
  { label: 'Verify', href: '/verify/' },
  { label: 'Solutions', href: '/solutions/' },
  { label: 'Regulatory', href: '/regulatory/' },
  { label: 'Trust', href: '/trust/' },
  { label: 'About', href: '/about/' },
];
