module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Fix for face-api.js trying to use Node.js modules in browser
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      return webpackConfig;
    },
  },
};
