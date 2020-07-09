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
    'pkg': grunt.file.readJSON('package.json'),

    'closureDepsWriter': {
      options: {
        closureLibraryPath: 'node_modules/google-closure-library',
      },
      helperDeps: {
        src: 'src/helper/helper.js',
        dest: 'src/deps.js',
      },
    },

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
          output_wrapper: '(function(){%output%})();',
          jscomp_warning: 'lintChecks',
        },
      },
    },
    'qunit': {
      files: ['test/unit.html'],
    },
    'karma': {
      options: {
        singleRun: true,
      },
      unit: {
        configFile: 'karma.conf.js',
      },
      integration: {
        configFile: 'test/integration/karma.conf.js',
      },
      unitBrowsers: {
        options: {
          frameworks: ['jasmine', 'detectBrowsers'],
          detectBrowsers: {
            enabled: true,
            // Don't try to load phantomJS, it may not exist.
            usePhantomJS: false,
          },
          flags: ['--no-sandbox'],
        },
        configFile: 'karma.conf.js',
      },
      integrationBrowsers: {
        options: {
          frameworks: ['jasmine', 'detectBrowsers'],
          detectBrowsers: {
            enabled: true,
            // Don't try to load phantomJS, it may not exist.
            usePhantomJS: false,
          },
          flags: ['--no-sandbox'],
        },
        configFile: 'test/integration/karma.conf.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('default', [
    'closureDepsWriter',
    'closure-compiler',
    'karma:unit',
    'karma:integration',
  ]);

  grunt.registerTask('test', [
    'closureDepsWriter',
    'closure-compiler',
    'karma:unitBrowsers',
    'karma:integrationBrowsers',
  ]);
};
