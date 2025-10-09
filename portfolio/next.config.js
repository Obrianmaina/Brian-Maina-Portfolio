/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-fra3-2.xx.fbcdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
