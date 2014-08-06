#!/usr/bin/env node

var fs         = require('fs');
var path       = require('path');
var uglifyjs   = require('uglify-js');
var browserify = require('browserify');
var banner     = fs.readFileSync(__dirname + '/../LICENSE').toString()
var src        = __dirname + '/../src/lill.coffee';

function minify(source) {
  var opts = { fromString: true, mangle: {
    toplevel: true
  }};
  return uglifyjs.minify(source, opts).code;
}

var bannerLines = banner.split("\n");
for (var i = 0, ii = bannerLines.length; i < ii; i++) {
  bannerLines[i] = "* " + bannerLines[i]
};
bannerLines.unshift("/*");
bannerLines.push("*/", "");
banner = bannerLines.join("\n");

var coffee = require('coffee-script');
var compiled = coffee.compile(fs.readFileSync(__dirname + '/../src/lill.coffee').toString(), {
  bare: true
});

var minified = minify(compiled);

fs.writeFileSync(__dirname + '/../lib/lill.js', banner + compiled);
fs.writeFileSync(__dirname + '/../lib/lill.min.js', banner + minified);

var bundleOptions = {
  entries: __dirname + '/../lib/lill.js',
  standalone: 'lill',
};

browserify(bundleOptions).bundle(function(err, buf) {
  if (err) {
    return console.error(err);
  }
  var out = buf.toString();
  fs.writeFileSync(__dirname + '/../lib/lill-browser.js', out);
  fs.writeFileSync(__dirname + '/../lib/lill-browser.min.js', banner + minify(out));
});
