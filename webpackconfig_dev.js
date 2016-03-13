var webpack = require("webpack");

module.exports = {
    entry: './src/js/main.js',
    output: {
        path: __dirname + '/src/js',
        filename: 'bundle.js'
    },
    bail: true,
    cache: false,
    devtool: 'inline-source-map',
    debug: true
};