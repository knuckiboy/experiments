/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const nextConfig = withPWA({
  reactStrictMode: true,
  distDir: "build",
  target: "serverless",
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  pwa: {
    dest: 'public'
}
});

module.exports = nextConfig;
