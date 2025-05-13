// remote-app/webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3001/',
    uniqueName: 'remoteApp',
  },
  resolve: { extensions: ['.jsx', '.js'] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  optimization: {
    splitChunks: false,    // bundle everything into remoteEntry.js
    runtimeChunk: false,   // no separate runtime
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './MainComponent': './src/MainComponent.jsx',  // simple string form
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
      },
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
