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
