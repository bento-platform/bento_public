const webpack = require('webpack'); // only add this if you don't have yet

// replace accordingly './.env' with the path of your .env file 
require('dotenv').config({ path: './.env' }); 


module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            } 
        ]
    },
    entry: {
        js: ['babel-polyfill', './src/js'],
      },
    output: {
        path: __dirname + '/build/www',
        publicPath: '',
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './distgetuk'
    },
    plugins: [
        //new Dotenv()
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
    ]
};