import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dznyfk4z6/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/mxjelcos/**",
      },
    ],

    formats: ["image/webp"],

    deviceSizes: [
      360, 420, 480, 540, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840,
    ],

    imageSizes: [32, 48, 64, 96, 128, 160, 192, 256, 320],

    qualities: [68, 70, 75],

    minimumCacheTTL: 604800,
  },

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
