const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'http://localhost:3000/',
  },
  resolve: { extensions: ['.jsx', '.js'] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      library: { type: 'var', name: 'hostApp' },
      filename: 'remoteHostEntry.js',
      remotes: {
        // dynamically inject remoteEntry.js with cache-bust
        remoteApp: `promise new Promise(resolve => {
          const remoteUrl = window.remoteAppUrl || 'http://localhost:3001/remoteEntry.js';
          const urlWithCache = remoteUrl + '?cacheBust=' + Date.now();
          const script = document.createElement('script');
          script.src = urlWithCache;
          script.type = 'text/javascript';
          script.async = true;
          script.onload = () => {
            const proxy = {
              get: (request) => window.remoteApp.get(request),
              init: (shareScope) => {
                try {
                  return window.remoteApp.init(shareScope);
                } catch(e) {}
              }
            };
            resolve(proxy);
          };
          document.head.appendChild(script);
        })`
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' }
      }
    }),
    new HtmlWebpackPlugin({ template: './public/index.html' })
  ],
};
