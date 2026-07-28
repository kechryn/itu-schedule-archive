import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site to ./out — no Node server, deployable to any
  // static host (Cloudflare Pages, GitHub Pages, Netlify) at zero cost.
  output: "export",
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
