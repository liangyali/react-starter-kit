"use strict";

var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

var STYLE_LOADER = 'style-loader/useable';
var CSS_LOADER = 'css-loader';

var DEBUG = !argv.release;

module.exports = [{
  entry: {
    bundle: './src/app/app.js',
  },
  output: {
    path: 'build/public/scripts',
    filename: '[name].js'
  },
  cache: DEBUG,
  debug: DEBUG,
  devtool: DEBUG ? '#inline-source-map' : false,
  stats: {
    colors: true,
    reasons: DEBUG
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  externals: [
    {
      'react': 'React',
      'react-router': 'ReactRouter',
      'lodash': '_'
    }
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ].concat(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
  module: {
    preLoaders: [{
      test: /\.js/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }],
    loaders: [
      {
        test: /\.css$/,
        loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader`
      },
      {
        test: /\.less$/,
        loader: `${STYLE_LOADER}!${CSS_LOADER}!postcss-loader!less-loader`
      },
      {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&mimetype=image/gif'
      },
      {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg'
      },
      {
        test: /\.png/,
        loader: 'url-loader?limit=10000&mimetype=image/png'
      },
      {
        test: /\.svg/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}];
