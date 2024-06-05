// nbaApp's craco.config.js

const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: "nbaApp",
          filename: "remoteEntry.js",
          exposes: {
            "./Widget": "./src/Widget",
          },
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: "^17.0.0" // Ensure this matches the version in package.json
            },
            "react-dom": {
              singleton: true,
              eager: true,
              requiredVersion: "^17.0.0" // Ensure this matches the version in package.json
            },
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
