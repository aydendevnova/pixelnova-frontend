/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import fs from "fs";
import path from "path";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },
  // Add Cloudflare compatibility
  output: "export",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  webpack(config) {
    config.experiments = { asyncWebAssembly: true, layers: true };

    // Handle both WASM and wasm_exec.js
    config.module.rules.push({
      test: /\.(wasm|js)$/,
      include: /public\/(main\.wasm|wasm_exec\.js)$/,
      type: "asset/resource",
      generator: {
        filename: "main.wasm", // Force consistent name
      },
    });

    return config;
  },
};

export default nextConfig;
