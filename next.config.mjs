/**
 * GitHub Pages serves project sites from a subpath (username.github.io/<repo>),
 * so every asset and route needs that prefix. The CI workflow sets
 * NEXT_PUBLIC_BASE_PATH; locally and on Netlify it is empty, which serves at root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a plain static site into out/ so it can be dragged straight into
  // Netlify's deploy box or published by GitHub Pages. No server runtime.
  output: "export",
  images: { unoptimized: true },

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  // Emit work/<slug>/index.html rather than work/<slug>.html. GitHub Pages
  // serves raw files and will not resolve an extensionless path otherwise.
  trailingSlash: true,
};

export default nextConfig;
