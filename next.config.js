const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['d2ibq52z3bzi2i.cloudfront.net'],
  },
}

module.exports = withNextIntl(nextConfig); 