/* global process */
/** @type {import('next').NextConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || '/api/payload'

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['drizzle-kit', 'esbuild', 'esbuild-register'],
  redirects: async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const url = payloadUrl.startsWith('http') ? `${payloadUrl}/redirects?limit=1000` : `${siteUrl}${payloadUrl}/redirects?limit=1000`
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!response.ok) return []

      const data = await response.json()
      return (data.docs || []).map(redirect => ({
        source: redirect.sourcePath,
        destination: redirect.destinationPath,
        permanent: redirect.type === '301',
      }))
    } catch {
      console.warn('Failed to load redirects from CMS, using empty list')
      return []
    }
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; base-uri 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; media-src 'self' data: https:; upgrade-insecure-requests;`,
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
