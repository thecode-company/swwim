const redirects = require('./helpers/dynamic-redirects.js');

module.exports = {
  async redirects() {
    const sanityRedirects = await redirects();
    return sanityRedirects;
  },
  images: {
    formats: ['image/webp'],
    domains: ['placedog.net', 'cdn.sanity.io'],
  },
  experimental: {
    optimizeCss: true
  }
};