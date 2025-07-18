import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ビルド時のESLintエラーで失敗しないようにする
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
