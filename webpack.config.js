const webpack = require('webpack'); // only add this if you don't have yet
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        type: 'javascript/auto',
        use: {
          loader: 'babel-loader',
        },
      },
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
  entry: {
    js: ['babel-polyfill', './src/js'],
  },
  output: {
    path: __dirname + '/build/www',
    publicPath: '',
    // filename: "js/bundle.js",
    filename: 'js/[name][chunkhash].js',
  },
  devServer: {
    static: './dist',
    contentBase: './distgetuk',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/public', to: 'public' }],
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  experiments: {
    topLevelAwait: true,
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
};
