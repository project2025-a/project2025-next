// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', port: '', pathname: '/**' }],
  },
  experimental: {
    serverActions: { bodySizeLimit: '20mb' },
  },

  // 👇 여기 추가 (www → non-www 301)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.placesurf.xyz' }],
        destination: 'https://placesurf.xyz/:path*',
        permanent: true, // 301
      },
    ];
  },
};

// next-intl 플러그인 적용
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
