/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["typeorm"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img1.kakaocdn.net",
      },
    ],
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "typeorm"];
    }
    return config;
  },
  // 또는 실험적으로
  experimental: {
    serverMinification: false,
  },

  eslint: {
    dirs: ["src"],
  },
};

export default nextConfig;
