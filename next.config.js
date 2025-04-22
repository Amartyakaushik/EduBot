/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add any necessary webpack customizations here
    return config;
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AI_API_URL: process.env.NEXT_PUBLIC_AI_API_URL,
    NEXT_PUBLIC_HUGGING_FACE_API_TOKEN: process.env.NEXT_PUBLIC_HUGGING_FACE_API_TOKEN,
  },
};

module.exports = nextConfig; 