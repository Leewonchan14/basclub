import withFlowbiteReact from "flowbite-react/plugin/nextjs";

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
};

export default withFlowbiteReact(nextConfig);