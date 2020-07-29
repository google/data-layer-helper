module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine'],
    files: [
      // Closure library
      {pattern: 'node_modules/google-closure-library/closure/goog/base.js'},
      // Source files
      // Dependencies must be listed before the file they are used in for
      // the googmodule preprocessor to function properly.
      {pattern: 'src/logging.js'},
      {pattern: 'src/plain/plain.js'},
      {pattern: 'src/helper/utils.js'},
      {pattern: 'src/helper/data-layer-helper.js'},
      // jQuery
      {pattern: 'test/lib/jquery*'},
      // Tests
      {pattern: 'test/utils.js'},
      {pattern: 'test/*_test.js'},
    ],
    preprocessors: {'**/*.js': ['googmodule']},
    plugins: [
      require('karma-jasmine'),
      require('karma-detect-browsers'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-ie-launcher'),
      require('karma-safari-launcher'),
      require('karma-spec-reporter'),
      require('karma-jasmine-html-reporter'),
      require('karma-googmodule-preprocessor'),
    ],
    browsers: ['Chrome'],
    reporters: ['spec', 'kjhtml'],
    port: 9876,
    colors: true,
    autoWatch: true,
    client: {
      clearContext: false,
    },
    singleRun: false,
    concurrency: Infinity,
  });
};
