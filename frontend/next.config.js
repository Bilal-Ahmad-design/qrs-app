/** @type {import('next').NextConfig} */

const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['drizzle-kit', 'esbuild', 'esbuild-register'],
  redirects: async () => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const response = await fetch(`${cmsUrl}/api/payload/redirects?limit=1000`, {
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
    } catch (error) {
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
            value: `default-src 'self'; base-uri 'self'; frame-ancestors 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: ${cmsUrl}; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https: ${cmsUrl}; media-src 'self' data: ${cmsUrl} https:; upgrade-insecure-requests;`,
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
