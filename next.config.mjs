/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 개발 서버 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Webpack 최적화
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // 개발 모드에서 캐시 최적화
      config.cache = {
        type: 'filesystem',
      };
    }
    return config;
  },
}

export default nextConfig
