const path = require('path');
const fs = require('fs');
const async = require('async');
const rimraf = require('rimraf');
const webpack = require('webpack');
const BS = require('browser-sync');
const configProd = require('./webpackconfig_prod.js');
const configDev = require('./webpackconfig_dev.js');

module.exports = function (args) {

    let browserSync;
    const protectedFolders = ['src', 'test', 'bdd'];

    const [env = 'production', buildPath = './build'] = args;
    const templateSrcPath = './src/index.html';
    const templateBuildPath = buildPath + '/index.html';
    const isDevelopment = env === 'development';
    if(!isDevelopment) process.env['NODE_ENV'] = 'production';

    const config = isDevelopment ? configDev(buildPath) : configProd(buildPath);

    build(buildPath, templateSrcPath, templateBuildPath, config);

    function build(fsPath, tplSrcPath, tplDstPath, config) {
        if (!isValidPath(fsPath)) {
            throw new Error('Build directory path is not valid or overlaps with some existing directories, check you configuration.');
        }

        async.series(
          [
              cbWrap(deleteBuildDirectory, [fsPath]),
              cbWrap(createBuildDirectory, [fsPath]),
              cbWrap(copyTemplate, [tplSrcPath, tplDstPath]),
              cbWrap(compile, [config])
          ],
          (err, result) => {
              if (err) {
                  console.error(err);
                  return;
              }
              if (env === 'development') {
                  runBrowserSync(fsPath);
              }
          }
        );
    }

    function deleteBuildDirectory(fsPath, cb) {
        isDirectory(fsPath, (err) => {
            if (err) {
                cb(null);
                return;
            }

            rimraf(fsPath, cb);
        });
    }

    function createBuildDirectory(fsPath, cb) {
        async.series(
          [
              cbWrap(fs.mkdir, [fsPath])
          ],
          (err) => cb(err)
        );
    }

    function copyTemplate(srcPath, dstPath, cb) {
        const stream = fs.createReadStream(srcPath)
          .pipe(fs.createWriteStream(dstPath));
        stream.on('finish', () => {
            cb(null);
        });
        stream.on('error', (err) => {
            cb(err)
        })
    }

    function compile(config, cb) {
        let callbackCalled;
        const webpackRunner = (err, stats) => {
            if (err) {
                if(!callbackCalled) {
                    callbackCalled = true;
                    cb(err);
                }
                return;
            }

            if (!stats.hasErrors()) {
                if (browserSync) {
                    browserSync.reload();
                }
                if(!callbackCalled) {
                    callbackCalled = true;
                    cb(null);
                }
            }
        };

        let compiler = webpack(config);

        if (isDevelopment) {
            compiler.watch(200, webpackRunner);
        } else {
            compiler.run(webpackRunner)
        }

    }

    function runBrowserSync(webroot) {
        browserSync = BS.create();
        browserSync.init({
            server: webroot
        });
    }

    function isDirectory(fsPath, cb) {
        fs.lstat(fsPath, (err, stats) => {
            if (!err && stats.isDirectory()) {
                cb();
                return;
            }
            cb(err || new Error('Provided path is not a directory'));
        });
    }

    function isValidPath(fsPath) {
        const currentPath = process.cwd();
        const absFsPath = path.resolve(fsPath);
        return absFsPath.startsWith(currentPath) && protectedFolders.indexOf(path.basename(fsPath)) === -1;
    }

    function cbWrap(func, args) {
        return function (cb) {
            func(...args, cb);
        }
    }
};
