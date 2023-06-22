/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    buildActivity: false
},
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true
  },
  reactStrictMode: true,
  swcMinify: false,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "projection-finance.s3.eu-west-3.amazonaws.com",
        pathname: "/next-s3-uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
