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
        src: 'src/helper/data-layer-helper.js',
        dest: 'src/deps.js',
      },
    },

    // Using https://www.npmjs.com/package/google-closure-compiler
    'closure-compiler': {
      options: {
        js: [
          'node_modules/google-closure-library/closure/goog/base.js',
          'src/logging.js',
          'src/plain/plain.js',
          'src/helper/utils.js',
        ],
        hide_warnings_for: 'google-closure-library',
        warning_level: 'VERBOSE',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ECMASCRIPT5_STRICT',
        output_wrapper: '(function(){%output%})();',
        jscomp_warning: 'lintChecks',
        generate_exports: true,
      },
      distribution: {
        files: {
          'dist/data-layer-helper.js': 'src/helper/data-layer-helper.js',
        },
        options: {
          // A source map can be used by other applications using this library
          // to debug their code.
          create_source_map: 'dist/data-layer-helper.js.map',
        },
      },
      debug: {
        files: {
          'dist/data-layer-helper-debug.js': 'src/helper/data-layer-helper.js',
        },
        options: {
          // A source map can be used by other applications using this library
          // to debug their code.
          define: 'DLH_DEBUG=true',
          create_source_map: 'dist/data-layer-helper-debug.js.map',
        },
      },
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

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('default', [
    'closureDepsWriter',
    'closure-compiler:distribution',
    'karma:unit',
    'karma:integration',
  ]);

  grunt.registerTask('build-debug', [
    'closureDepsWriter',
    'closure-compiler:debug',
    'karma:unit',
    'karma:integration',
  ]);

  grunt.registerTask('test', [
    'closure-compiler',
    'karma:unitBrowsers',
    'karma:integrationBrowsers',
  ]);
};
