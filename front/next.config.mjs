/** @type {import('next').NextConfig} */
const nextConfig = {
  // CAPACITOR=1 npm run build  → static export (out/ dizinine)
  // npm run build              → standalone (Docker icin)
  output: process.env.CAPACITOR === "1" ? "export" : "standalone",
  // Static export icin image optimizasyonu kapatilir
  ...(process.env.CAPACITOR === "1" && {
    images: { unoptimized: true },
  }),
};

export default nextConfig;
