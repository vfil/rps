const path = require('path');
const webpack = require('webpack');

module.exports = function (buildPath) {
    return {
        entry: './src/js/main.js',
        output: {
            path: path.join(__dirname, buildPath),
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                    test: /\.(png|jpg|gif)$/,
                    loaders: ['url', 'image-webpack']
                },
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass?sourceMap']
                },
                {
                    test: /\.(ttf|eot|woff)(\?[a-z0-9=&.]+)?$/,
                    loaders: ['file-loader?name=/fonts/[hash].[ext]']
                },
                {
                    test: /\.(svg|ico)(\?[a-z0-9=&.]+)?$/,
                    loaders: ['file-loader?name=/imgs/[hash].[ext]']
                }
            ]
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    };
};
