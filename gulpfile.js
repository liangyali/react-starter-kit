"use strict";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var assign = require('object-assign');
var argv = require('minimist')(process.argv.slice(2));

var src = {};
var watch = false;
var browserSync;

// the default task
gulp.task('default', ['sync']);

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'build/*', '!/build/.git']));

// Static files copy
gulp.task('assets', function () {
  src.assets = [
    './src/public/*'
  ];
  return gulp.src(src.assets)
    .pipe($.changed('build/public'))
    .pipe(gulp.dest('build/public'))
    .pipe($.size({title: 'assets'}));
});

// server files copy
gulp.task('resources', function () {
  src.resources = [
    './src/server.js'
  ];
  return gulp.src(src.resources)
    .pipe($.changed('build'))
    .pipe(gulp.dest('build'))
    .pipe($.size({title: 'resources'}));
});

// webpack bundle
gulp.task('bundle', function (cb) {

  var config = require('./webpack.config.js');
  var started = false;
  var compiler = webpack(config);

  function bundle(err, stats) {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }

    var verbose = !!argv.verbose;
    console.log(stats.toString({
      colors: $.util.colors.supportsColor,
      hash: verbose,
      version: verbose,
      timings: verbose,
      chunks: verbose,
      chunkModules: verbose,
      cached: verbose,
      cachedAssets: verbose
    }));

    if (!started) {
      started = true;
      return cb();
    }
  }

  if (watch) {
    compiler.watch(200, bundle);
  } else {
    compiler.run(bundle);
  }
});

// build task
gulp.task('build', ['clean'], function (cb) {
  runSequence(['assets', 'resources'], ['bundle'], cb);
});

// build watch
gulp.task('build:watch', function (cb) {
  watch = true;

  runSequence('build', function () {
    gulp.watch(src.assets, ['assets']);
    cb();
  });
});

// Launch a Node.js/Express server
gulp.task('serve', ['build:watch'], function (cb) {
  src.server = [
    'build/server.js'
  ];

  var started = false;
  var cp = require('child_process');

  var server = (function startup() {
    var child = cp.fork('./build/server.js', {
      env: assign({NODE_ENV: 'development'}, process.env)
    });
    child.once('message', function (message) {
      if (message.match(/^online$/)) {
        if (browserSync) {
          browserSync.reload();
        }
        if (!started) {
          started = true;
          gulp.watch(src.server, function () {
            $.util.log('Restarting development server.');
            server.kill('SIGTERM');
            server = startup();
          });
          cb();
        }
      }
    });
    return child;
  })();

  process.on('exit', function () {
    server.kill('SIGTERM');
  });
});

// Launch BrowserSync development server
gulp.task('sync', ['serve'], function (cb) {
  browserSync = require('browser-sync');

  browserSync({
    logPrefix: 'app',
    notify: false,
    https: false,
    proxy: 'localhost:' + (process.env.PORT || 5000)
  }, cb);

  process.on('exit', function () {
    browserSync.exit()
  });

  gulp.watch(['build/**/*.*'].concat(
    src.server.map(function (file) {
      return '!' + file;
    })
  ), function (file) {
    browserSync.reload(path.relative(__dirname, file.path));
  });
});

