const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : 'bundle.js',
      publicPath: './',
      clean: true
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      splitChunks: { chunks: 'all' }
    },
    plugins: [
      // Copy static files from public (except index.html)
      new CopyPlugin({
        patterns: [
          { from: 'public/sw-registration.js', to: '' }
        ]
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        templateParameters: {
          buildHash: isProduction ? Date.now() : '' 
        },
        minify: isProduction && { /* … */ }
      }),
    ]
  };

  if (!isProduction) {
    // Development: HMR
    config.devtool = 'inline-source-map';
    config.devServer = { static: path.join(__dirname, 'dist'), port: 3000, hot: true };
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    // Production: Service Worker generation
    config.plugins.push(
      new GenerateSW({ clientsClaim: true, skipWaiting: true, navigateFallback: './index.html' })
    );
  }

  return config;
};