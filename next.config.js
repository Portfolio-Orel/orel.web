/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, _) =>
    {
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
