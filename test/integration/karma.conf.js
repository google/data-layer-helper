const baseConfig = require('../../karma.conf');

module.exports = function(config) {
  baseConfig(config);
  config.set({
    files: [
      './**_test.js',
      '../utils.js',
      '../../dist/data-layer-helper.js',
    ],
  });
};
