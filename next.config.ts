import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project repo from a subpath
 * (https://<user>.github.io/<repo>), so every URL the site emits has to be
 * prefixed. Set NEXT_PUBLIC_BASE_PATH to "/<repo>" for that case, or leave it
 * empty when serving from a domain root (custom domain, Cloudflare, Netlify).
 *
 * It is NEXT_PUBLIC_* because lib/data/client.ts fetches the course JSON by
 * hand: Next rewrites <Link> and /_next asset URLs automatically, but a raw
 * fetch('/data/...') it cannot see, so the browser bundle needs the value too.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site to ./out — no Node server, deployable to any
  // static host (GitHub Pages, Cloudflare Pages, Netlify) at zero cost.
  output: "export",
  // Emit archive/index.html rather than archive.html. Next produces both a
  // page file and a same-named directory of RSC payloads, and a static host
  // asked for /archive then has to guess between them — GitHub Pages guesses
  // the directory and 404s. A trailing slash removes the ambiguity.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
