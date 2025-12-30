const nextConfig = {
  output: "export",
  transpilePackages: ["antd-mobile"],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
