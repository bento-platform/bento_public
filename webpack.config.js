const webpack = require('webpack'); // only add this if you don't have yet
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    path: __dirname + '/build/www',
    publicPath: '',
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
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = (_env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
  }
  return config;
};
