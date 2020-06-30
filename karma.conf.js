const BROWSERS_TO_TEST = ['Chrome'];

module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine', 'closure'],
    files: [
      // closure library
      {pattern: 'node_modules/google-closure-library/closure/goog/base.js'},
      {pattern: 'node_modules/google-closure-library/closure/goog/deps.js',
        included: false, served: false},
      // source files
      {pattern: 'src/**/*.js', included: false},
      // tests
      {pattern: 'test/**_test.js'},
      // jquery
      {pattern: 'test/lib/jquery*'},
    ],
    preprocessors: {
      // Tests are preprocessed for dependencies (closure) and iits.
      'test/**/*_test.js': ['closure', 'closure-iit'],
      // Source files are preprocessed for dependencies/
      'src/*/*.js': ['closure'],
      'node_modules/google-closure-library/closure/goog/deps.js':
          ['closure-deps'],
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-closure'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-jasmine-html-reporter'),
    ],
    reporters: ['spec', 'kjhtml'],
    port: 9876,
    colors: true,
    autoWatch: true,
    browsers: BROWSERS_TO_TEST,
    client: {
      clearContext: false,
    },
    singleRun: false,
    concurrency: Infinity,
  });
};
