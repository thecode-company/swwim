const redirects = require('./helpers/dynamic-redirects.js');

module.exports = {
  async redirects() {
    const sanityRedirects = await redirects();
    return sanityRedirects;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' *.sanity.io *.swimm.io; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sanity.io *.swimm.io *.google-analytics.com *.googletagmanager.com *.facebook.net *.pinimg.com *.licdn.com *.tiktok.com; style-src 'self' 'unsafe-inline' *.googleapis.com; img-src 'self' data: *.sanity.io *.giphy.com *.placedog.net *.ads.linkedin.com *.linkedin.com; font-src 'self' *.gstatic.com; connect-src 'self' *.sanity.io *.swimm.io *.google-analytics.com *.doubleclick.net *.facebook.com *.linkedin.com *.pinimg.com *.tiktok.com *.pinterest.com; frame-src 'self' *.youtube.com *.vimeo.com *.swimm.io *.mailchimp.com *.facebook.com *.pinterest.com",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/webp'],
    domains: ['placedog.net', 'cdn.sanity.io'],
  },
  experimental: {
    optimizeCss: true
  }
};