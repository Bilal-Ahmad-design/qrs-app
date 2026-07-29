import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qrsrisk.com';

  const pages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/platform', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/trust', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/validation', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/security', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/security/vdp', priority: 0.8, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.7, changeFrequency: 'yearly' as const },
    { path: '/support', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
