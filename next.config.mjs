/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a plain static site into out/ so it can be dragged straight into
  // Netlify's deploy box. No server runtime required.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
