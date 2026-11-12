/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_APIKEY: "AIzaSyBZdIfgKBtBP8uVy4FYRXUHrZM7bHjz0fI",
    NEXT_PUBLIC_FIREBASE_AUTHDOMAIN: "orelsweb.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECTID: "orelsweb",
    NEXT_PUBLIC_FIREBASE_STORAGEBUCKET: "orelsweb.appspot.com",
    NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID: "384710065237",
    NEXT_PUBLIC_FIREBASE_APPID: "1:384710065237:web:ac9e25009994f32439a8dc",
    NEXT_PUBLIC_FIREBASE_MEASUREMENTID: "G-N6G85SSYSY",
    NEXT_PUBLIC_BASE_URL: "https://us-central1-orelsweb.cloudfunctions.net/",
    NEXT_PUBLIC_APP_BASE_URL: "https://www.orelzilberman.com",
    NEXT_PUBLIC_ENV: "production",
    // NEXT_PUBLIC_BASE_URL: "http://127.0.0.1:5001/orelsweb/us-central1/",
    // NEXT_PUBLIC_APP_BASE_URL: "http://localhost:3000",
    // NEXT_PUBLIC_ENV: "dev",
  },
  webpack: (config, _) => {
    config.module.rules.push({
      test: /\.pdf$/i,
      type: 'asset/source'
    })

    return config
  },
  reactStrictMode: true,
  swcMinify: false,
  // The bot floor is a separate Next app. These rewrites proxy /admin on this
  // host to that app. vercel.json repeats them so the edge still proxies when
  // this deployment serves the path as a static miss.
  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "https://orel-bots-dashboard.vercel.app/admin",
      },
      {
        source: "/admin/:path*",
        destination: "https://orel-bots-dashboard.vercel.app/admin/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
