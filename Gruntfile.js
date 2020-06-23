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

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    closureDepsWriter: {
      options: {
        closureLibraryPath: 'third_party/closure-library',
      },
      helperDeps: {
        src: 'src/helper/helper.js',
        dest: 'src/deps.js'
      }
    },

    closureCompiler: {
      options: {
        closureLibraryPath: 'third_party/closure-library',
        compilerFile: 'third_party/closure-compiler/compiler.jar',
        compilerOpts: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          output_wrapper: `'(function(){%output%})();'`,
          jscomp_warning: 'lintChecks',
          closure_pass: true,
        },
        execOpts: {
          // fix Error: maxBuffer exceeded
          maxBuffer: 10000 * 1024,
        },
        TieredCompilation: true
      },
      helper: {
        src: ['src', 'third_party/closure-library/closure/goog/base.js'],
        dest: 'dist/data-layer-helper.js',
      }
    },

    qunit: {
      files: ['test/unit.html', 'test/integration.html']
    },
  });

  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.registerTask('default', [
    'closureDepsWriter',
    'closureCompiler',
    'qunit'
  ]);
};
