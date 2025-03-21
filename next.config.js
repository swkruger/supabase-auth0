/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    // Only expose public variables to the client
    NEXT_PUBLIC_AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
    NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
  },
  // Add security headers
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.auth0.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 