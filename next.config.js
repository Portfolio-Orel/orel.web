/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, _) => {
    config.module.rules.push({
      test: /\.pdf$/i,
      type: 'asset/source'
    })

    return config
  },
  reactStrictMode: true,
  swcMinify: false
};

module.exports = nextConfig;
