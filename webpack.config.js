/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');

const createServiceInfo = require('./create_service_info');

// noinspection JSUnusedGlobalSymbols
const makeConfig = (mode) => ({
  mode: 'development',
  entry: './src/js/index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    // filename: "js/bundle.js",
    filename: mode === 'production' ? 'js/[name][chunkhash].js' : 'js/[name].js',
    clean: true,
  },
  ...(mode === 'development' ? { devtool: 'inline-source-map' } : {}),
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
  watchOptions: {
    aggregateTimeout: 200,
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
      BENTO_PUBLIC_URL: null,
      // Display flags
      BENTO_PUBLIC_TRANSLATED: null,
      BENTO_PUBLIC_SHOW_PORTAL_LINK: null,
      BENTO_PUBLIC_SHOW_SIGN_IN: null,
      BENTO_PUBLIC_FORCE_CATALOGUE: null, // Show data catalogue even with 1 project
      // Beacon configuration and flags
      BEACON_URL: null,
      BENTO_BEACON_UI_ENABLED: null,
      BENTO_BEACON_NETWORK_ENABLED: null,
      // Authentication
      CLIENT_ID: null,
      OPENID_CONFIG_URL: null,
    }),
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
  devServer: {
    compress: true,
    historyApiFallback: {
      // Allows url parameters containing dots in the devServer
      disableDotRule: true,
    },

    host: '0.0.0.0',
    port: process.env.BENTO_PUBLIC_PORT ?? 5000,

    watchFiles: {
      paths: ['src/**/*.js', 'src/**/*.ejs'],
      options: {
        usePolling: true,
      },
    },

    devMiddleware: {
      writeToDisk: true,
    },

    setupMiddlewares(middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      devServer.app.get('/service-info', (req, res) => {
        res.header('Content-Type', 'application/json');
        res.json(createServiceInfo.serviceInfo);
      });

      return middlewares;
    },

    allowedHosts: 'all',
  },
});

module.exports = (_env, argv) => makeConfig(argv.mode);
