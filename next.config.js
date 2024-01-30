/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.r2.dev',
                port: '',
                pathname: '/generations/**',
            },
        ],
    },
}

module.exports = nextConfig
