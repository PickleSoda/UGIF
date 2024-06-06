const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
  basePath: '',
  webpack: (config, { isServer, dev }) => {
    // Enable source maps in production
    if (!dev) {
      config.devtool = 'source-map';
      
      // Add TerserPlugin to minimize and remove console logs
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // This removes console.* calls
              unused: true,
              loops: true,
              toplevel: true,
              arguments: true,
              drop_debugger: true,
              conditionals: true,
              dead_code: true,
              evaluate: true,
              comparisons: true,
              hoist_funs: true,
              hoist_props: true,
              hoist_vars: true,
            },
          },
        })
      );

      // Add BundleAnalyzerPlugin to analyze bundle size
      // config.plugins.push(new BundleAnalyzerPlugin());
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
  ],
};
