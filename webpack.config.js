const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
  devtool: isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
  entry: './src/bin/server.js',
  target: 'node',
  mode: nodeEnv,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', 'jsx'],
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@database': path.resolve(__dirname, './src/database'),
      '@config': path.resolve(__dirname, './src/config'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@middlewares': path.resolve(__dirname, './src/middlewares'),
      '@routes': path.resolve(__dirname, './src/routes'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new WebpackShellPlugin({
      // onBuildEnd: ['exit(1)']
    })
  ],
  externals: [nodeExternals()]
};
