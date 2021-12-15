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
    } 
};