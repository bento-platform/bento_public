const webpack = require('webpack'); // only add this if you don't have yet
const HtmlWebpackPlugin = require('html-webpack-plugin');

// load client.env
require('dotenv').config({ path: './client.env' });

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
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
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
    //new Dotenv()
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      inject: false,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
};
