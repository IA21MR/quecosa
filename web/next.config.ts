import type { NextConfig } from 'next';

function parseImageHosts(): NextConfig['images'] {
  const hosts = process.env.NEXT_IMAGE_HOSTS || '';
  if (!hosts.trim()) return { remotePatterns: [] };
  const remotePatterns = hosts
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
    .map((h) => {
      const url = new URL(h);
      return {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port || '',
        pathname: '/uploads/**',
      };
    });
  return { remotePatterns };
}

const nextConfig: NextConfig = {
  output: 'standalone',
  images: parseImageHosts(),
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
