import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'

const jsCookieAliasPath = path.resolve(process.cwd(), 'src/lib/js-cookie-alias.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  turbopack: {
    resolveAlias: {
      'js-cookie': './src/lib/js-cookie-alias.js',
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      'js-cookie': jsCookieAliasPath,
    }
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
