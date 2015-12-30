#!/usr/bin/env node

var fs         = require('fs');
var path       = require('path');
var name       = 'lill';
var src        = path.resolve(__dirname + '/../src/' + name + '.js');
var target     = path.resolve(__dirname + '/../lib');
var dist       = path.resolve(__dirname + '/../dist');
var pkg        = require('../package.json');

var bannerSource = fs.readFileSync(__dirname + '/../LICENSE').toString()
var bannerLines = bannerSource.split('\n');
for (var i = 0, ii = bannerLines.length; i < ii; i++) {
  bannerLines[i] = '* ' + bannerLines[i]
};
bannerLines.unshift('/*!');
bannerLines.push('* ', '* Version: ' + pkg['version'], '*/', '');
var banner = bannerLines.join('\n');

var logFile = function(fileName) {
  console.log('written file ' + fileName);
}

var babel = require('babel-core');
var transformed = babel.transformFileSync(src);
var libFileName = path.join(target, name + '.js');
fs.writeFileSync(libFileName, banner + transformed.code);
logFile(libFileName);

var webpack = require('webpack');

(runWebpack = function(minified) {
  webpack({
    entry: src,
    output: {
      path: dist,
      pathinfo: !minified,
      filename: name + (minified ? '.min' : '') + '.js',
      library: 'LiLL',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },
    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel', include: /src/ },
      ],
    },
    devtool: (minified ? 'source-map' : null) ,
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.BannerPlugin(bannerSource),
    ].concat(minified ? [new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
    })] : [])
  }, (err, stats) => {
    if (err) {
      throw err;
    }
    if (stats.hasErrors()) {
      return console.log(stats.toString({
        colors: true,
        errorDetails: true,
      }))
    }
    var files = stats.toJson().assetsByChunkName['main'];
    if (!Array.isArray(files)) {
      files = [files];
    }
    files.forEach(function(file) {
      logFile(path.join(dist, file));
    });
  });
})();

runWebpack(true);
