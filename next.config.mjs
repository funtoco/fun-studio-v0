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
  env: {
    ALLOW_LEGACY_IMPORTS: 'false',
    IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE: 'true',
  },
}

export default nextConfig
