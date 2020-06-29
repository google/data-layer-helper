/**
 * Copyright 2013 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


module.exports = function(grunt) {
  const closurePackage = require('google-closure-compiler');
  closurePackage.grunt(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Using https://www.npmjs.com/package/google-closure-compiler
    'closure-compiler': {
      my_target: {
        files: {
          'dist/data-layer-helper.js': 'src/helper/**.js',
        },
        options: {
          js: [
            'node_modules/google-closure-library/closure/goog/base.js',
            'src/plain/**.js',
          ],
          hide_warnings_for: 'google-closure-library',
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT6',
          create_source_map: 'dist/data-layer-helper.js.map',
          output_wrapper: '(function(){%output%})();',
          jscomp_warning: 'lintChecks',
        },
      },
    },
    qunit: {
      files: ['test/unit.html'],
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        // run the karma tests only once in a headless chrome instance
        // so the build does not freeze
        browsers: ['ChromeHeadless'],
        singleRun: true,
        failOnEmptyTestSuite: false,
      },
      unit: {},
      integration: {
        // The integration tests require a separate configuration,
        // we only want to use the distribution files. Karma only supports
        // running 1 configuration, so it only runs the unit tests when you call
        // karma start - to run the integration tests, run the build with grunt.
        options: {
          files: [
            'test/integration/integration_test.js',
            'dist/data-layer-helper.js',
          ],
          preprocessors: [],
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', [
    'closure-compiler',
    'qunit',
    'karma',
  ]);
};
