"use strict";

var babel = require('babel-core');


module.exports = {
  process: function (src, filename) {

    // ignore files
    if (!babel.canCompile(filename)) {
      return '';
    }

    // ignore all files within node_modules
    if (filename.indexOf('node_modules') === -1) {
      return babel.transform(src, {filename: filename}).code;
    }

    return src;
  }
};
