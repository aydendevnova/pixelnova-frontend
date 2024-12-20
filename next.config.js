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
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };

    // Add WASM handling
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: "static/wasm/[name][ext]",
      },
    });

    // Add copy plugin to ensure WASM files are in the root as well
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap("CopyWasmPlugin", (compilation) => {
          fs.copyFileSync("public/main.wasm", "out/main.wasm");
          fs.copyFileSync("public/wasm_exec.js", "out/wasm_exec.js");
        });
      },
    });

    return config;
  },
};

export default nextConfig;
