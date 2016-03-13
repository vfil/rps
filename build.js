'use strict';

var webpack = require("webpack");
var browserSync;

function bundle(err, stats) {
    console.log('START Building bundle...');
    if (err) {
        console.error(err);
    }
    if(browserSync) {
        console.log('Reloading browser sync...');
        browserSync.reload();
    }
}

var config;
var bundler;

if(process.argv[2] === 'PROD') {
    config = require('./webpackconfig_prod.js');
    bundler = webpack(config);
    bundler.run(bundle);
} else if(process.argv[2] === 'DEV') {
    config = require('./webpackconfig_dev.js');
    bundler = webpack(config);
    bundler.watch(200, bundle);

    browserSync = require('browser-sync').create();
    browserSync.init({
        server: './src',

        files: [
            './src/js/**/*.js',
            './src/index.html'
        ]
    });
} else {
    console.error('NO VALID ENV SPECIFIED FOR BUILDING!!!')
}
