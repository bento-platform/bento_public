const path = require('path');

// const webpack = require('webpack'); // only add this if you don't have yet
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { webcrypto } = require('crypto');
const { webpack, EnvironmentPlugin } = require('webpack');

const config = {
  mode: 'development',
  entry: './src/js/index.tsx',
  output: {
    path: __dirname + '/build/www',
    publicPath: '/',
    // filename: "js/bundle.js",
    filename: 'js/[name][chunkhash].js',
  },
  module: {
    rules: [
      { test: /\.[tj](sx|s)?$/, use: { loader: 'ts-loader' }, exclude: /node_modules/ },
      {
        test: /\.(sass|less|css)$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' }],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  devServer: {
    static: './dist',
    contentBase: './dist',
  },
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/public', to: 'public' }],
    }),
    new EnvironmentPlugin({
      // Default environment variables to null if not set
      // General
      BENTO_PUBLIC_CLIENT_NAME: null,
      BENTO_PUBLIC_PORTAL_URL: null,
      BENTO_PUBLIC_TRANSLATED: null,
      BEACON_URL: null,
      BENTO_BEACON_UI_ENABLED: null,
      // Authentication
      BENTO_PUBLIC_URL: null,
      CLIENT_ID: null,
      OPENID_CONFIG_URL: null,
    })
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/js'),
      '@public': path.resolve(__dirname, 'src/public'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
};
