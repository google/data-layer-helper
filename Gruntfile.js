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

    closureBuilder:  {
      options: {
        // [REQUIRED] To find the builder executable we need either the path to
        //    closure library or directly the filepath to the builder:
        closureLibraryPath: 'path/to/closure-library', // path to closure library
        // [OPTIONAL] You can define an alternative path of the builder.
        //    If set it trumps 'closureLibraryPath' which will not be required.
        builder: 'path/to/closurebuilder.py',

        // [REQUIRED] One of the two following options is required:
        inputs: 'string|Array', // input files (can just be the entry point)
        namespaces: 'string|Array', // namespaces

        // [OPTIONAL] The location of the compiler.jar
        // This is required if you set the option "compile" to true.
        compilerFile: 'path/to/compiler.jar',

        // [OPTIONAL] output_mode can be 'list', 'script' or 'compiled'.
        //    If compile is set to true, 'compiled' mode is enforced.
        //    Default is 'script'.
        output_mode: '',

        // [OPTIONAL] if we want builder to perform compile
        compile: false, // boolean

        compilerOpts: {
          /**
          * Go wild here...
          * any key will be used as an option for the compiler
          * value can be a string or an array
          * If no value is required use null
          */
        },
      },

      // any name that describes your operation
      targetName: {

        // [REQUIRED] paths to be traversed to build the dependencies
        src: 'string|Array',

        // [OPTIONAL] if not set, will output to stdout
        dest: ''
      }
    }
  });

  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.registerTask('default', ['closureBuilder']);
};
