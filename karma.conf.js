// Karma configuration
module.exports = function(config) {
  config.set({
    basePath: '.',
    frameworks: ['jasmine', 'closure'],
    files: [
      // closure library
      {pattern: 'third_party/closure-library/closure/goog/base.js'},
      {pattern: 'third_party/closure-library/closure/goog/deps.js',
        included: false, served: false},
      // source files
      {pattern: 'src/**/*.js', included: false},
      // tests
      {pattern: 'test/**_test.js'},
      // jquery
      {pattern: 'test/lib/jquery*'},
    ],
    preprocessors: {
      // tests are preprocessed for dependencies (closure) and iits
      'test/**/*_test.js': ['closure', 'closure-iit'],
      // source files are preprocessed for dependencies
      'src/*/*.js': ['closure'],
      'third_party/closure-library/closure/goog/deps.js': ['closure-deps'],
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-closure'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-jasmine-html-reporter')
    ],
    reporters: ['spec', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DISABLE,
    autoWatch: true,
    browsers: ['Chrome'],
    client: {
      clearContext: false
    },
    singleRun: false,
    concurrency: Infinity,
  })
}
