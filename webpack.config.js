const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      filename:      isProduction ? '[name].[contenthash].js' : '[name].js',
   chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js',
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
      // Copy static assets
      new CopyPlugin({
        patterns: [
          { from: 'public/sw-registration.js', to: '' }
        ]
      }),
      // Emit a chunk-manifest.json mapping chunkName → hashed filename
     isProduction && new WebpackManifestPlugin({
         fileName: 'chunk-manifest.json',
         generate(seed, files) {
           const manifest = {};
           files.forEach(file => {
            if (file.isChunk && file.chunk && typeof file.chunk.id !== 'undefined') {
              // file.name is e.g. "app.456def.js"
              manifest[file.chunk.id] = file.path;
            }
           });
           return manifest;
         }
       }),

      // HTML template
      new HtmlWebpackPlugin({
        template: './public/index.html',
        templateParameters: (compilation, assets, assetTags, options) => ({
          buildHash: isProduction ? compilation.hash : String(Date.now())
        }),
        minify: isProduction && {
          removeComments: true,
          collapseWhitespace: true
        }
      }),

      // Service Worker for production
      isProduction && new GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: './index.html',
        exclude: [/app\.js$/],
        runtimeCaching: [
          {
            urlPattern: /\/index\.html$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'html-cache' }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'assets-cache' }
          }
        ]
      }),

      // HMR plugin for development
      !isProduction && new webpack.HotModuleReplacementPlugin()
    ].filter(Boolean),

    // DevServer only in development
    ...(isProduction
      ? {}
      : {
          devtool: 'inline-source-map',
          devServer: {
            static: path.join(__dirname, 'dist'),
            port: 3000,
            hot: true
          }
        })
  };
};