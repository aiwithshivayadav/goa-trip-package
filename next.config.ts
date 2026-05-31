import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization — allow WP uploads and Vercel Blob
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "goatrippackage.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "royalcruisegoa.com",
      },
      {
        protocol: "https",
        hostname: "partyyachtgoa.com",
      },
    ],
  },

  // Strict mode for catching bugs early
  reactStrictMode: true,

  // Server external packages (Prisma, Nodemailer, react-pdf need Node runtime)
  serverExternalPackages: ["@prisma/client", "nodemailer", "@react-pdf/renderer", "bcryptjs"],

  // Headers for security + performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Redirects for sister brands (when domain-aliased on Vercel)
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
