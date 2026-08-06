/** @type {import('next').NextConfig} */

const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

const nextConfig = {
  reactStrictMode: true,
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
        ],
      },
    ];
  },
};

export default nextConfig;
