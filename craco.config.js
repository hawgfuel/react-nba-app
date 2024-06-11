const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'nbaApp',
          filename: 'remoteEntry.js',
          exposes: {
            './Widget': './src/Widget', // Ensure this path is correct
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
          },
        })
      );
      return webpackConfig;
    },
  },
  devServer: {
    port: 3001, // Set the port for nbaApp
  },
};
