/**
 * Copyright 2012 Google Inc. All rights reserved.
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

/**
 * @fileoverview Unit tests for merge().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

test('merge', function() {

  function assertMerge(from, to, expected) {
    var fromCopy = helper.isArray_(from) ? [] : {};
    jQuery.extend(true, fromCopy, from);
    helper.merge_(from, to);
    deepEqual(from, fromCopy);
    deepEqual(to, expected);
  }

  // If <from> property is array and <to> property is "other", <to> property
  // will be overwritten.
  assertMerge({a: []}, {}, {a: []});
  assertMerge({a: []}, {a: 1}, {a: []});
  assertMerge({a: []}, {b: 2}, {a: [], b: 2});
  assertMerge({a: []}, {a: 1, b: 2}, {a: [], b: 2});
  assertMerge({a: [1, 2]}, {}, {a: [1, 2]});
  assertMerge({a: [1, 2]}, {a: 1}, {a: [1, 2]});
  assertMerge({a: [1, 2]}, {b: 2}, {a: [1, 2], b: 2});
  assertMerge({a: [1, 2]}, {a: 1, b: 2}, {a: [1, 2], b: 2});
  assertMerge({a: [], b: []}, {}, {a: [], b: []});
  assertMerge({a: [], b: []}, {a: 1, b: 2}, {a: [], b: []});
  assertMerge({a: [], b: []}, {a: 1, b: 2, c: 3}, {a: [], b: [], c: 3});

  // If <from> property is array and <to> property is "array", <from> property
  // will be merged into <to> property.
  assertMerge({a: []}, {a: []}, {a: []});
  assertMerge({a: []}, {a: [1]}, {a: [1]});
  assertMerge({a: []}, {a: [undefined, 2]}, {a: [undefined, 2]});
  assertMerge({a: [1]}, {a: [undefined, 2]}, {a: [1, 2]});
  assertMerge({a: [1, 2]}, {a: [undefined, 2]}, {a: [1, 2]});
  assertMerge({a: [1, 2, 3]}, {a: [undefined, 2]}, {a: [1, 2, 3]});
  assertMerge({a: [1, 3, 3]}, {a: [undefined, 2]}, {a: [1, 3, 3]});
  assertMerge({a: [1, 2, 3]}, {a: []}, {a: [1, 2, 3]});

  // If <from> property is plain object and <to> property is "other",
  // <to> property will be overwritten.
  assertMerge({a: {}}, {}, {a: {}});
  assertMerge({a: {}}, {a: 1}, {a: {}});
  assertMerge({a: {}}, {b: 2}, {a: {}, b: 2});
  assertMerge({a: {}}, {a: 1, b: 2}, {a: {}, b: 2});
  assertMerge({a: {x: 1, y: 2}}, {}, {a: {x: 1, y: 2}});
  assertMerge({a: {x: 1, y: 2}}, {a: 1}, {a: {x: 1, y: 2}});
  assertMerge({a: {x: 1, y: 2}}, {b: 2}, {a: {x: 1, y: 2}, b: 2});
  assertMerge({a: {x: 1, y: 2}}, {a: 1, b: 2}, {a: {x: 1, y: 2}, b: 2});
  assertMerge({a: {}, b: {}}, {}, {a: {}, b: {}});
  assertMerge({a: {}, b: {}}, {a: 1, b: 2}, {a: {}, b: {}});
  assertMerge({a: {}, b: {}}, {a: 1, b: 2, c: 3}, {a: {}, b: {}, c: 3});

  // If <from> property is plain object and <to> property is plain object,
  // <from> property will be merged into <to> property.
  assertMerge({a: {}}, {a: {}}, {a: {}});
  assertMerge({a: {}}, {a: {x: 1}}, {a: {x: 1}});
  assertMerge({a: {}}, {a: {x: undefined, y: 2}}, {a: {x: undefined, y: 2}});
  assertMerge({a: {x: 1}}, {a: {x: undefined, y: 2}}, {a: {x: 1, y: 2}});
  assertMerge({a: {x: 1}}, {a: {x: undefined, y: 2}}, {a: {x: 1, y: 2}});
  assertMerge({a: {x: 1, y: 2}}, {a: {x: undefined, y: 2}}, {a: {x: 1, y: 2}});
  assertMerge({a: {x: 1, y: 2, z: 3}}, {a: {x: undefined, y: 2}},
      {a: {x: 1, y: 2, z: 3}});
  assertMerge({a: {x: 1, y: 3, z: 3}}, {a: {x: undefined, y: 2}},
      {a: {x: 1, y: 3, z: 3}});
  assertMerge({a: {x: 1, y: 2, z: 3}}, {a: {}}, {a: {x: 1, y: 2, z: 3}});

  // If <from> property is "other", <to> property will be overwritten.
  // Even when <to> property is undefined.
  assertMerge({a: null}, {}, {a: null});
  assertMerge({a: true}, {}, {a: true});
  assertMerge({a: false}, {}, {a: false});
  assertMerge({a: 1}, {}, {a: 1});
  assertMerge({a: 0}, {}, {a: 0});
  assertMerge({a: -1}, {}, {a: -1});
  assertMerge({a: 0.01}, {}, {a: 0.01});
  assertMerge({a: ''}, {}, {a: ''});
  assertMerge({a: 'brian'}, {}, {a: 'brian'});
  assertMerge({a: 'with.dots'}, {}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({a: d}, {}, {a: d});
  var re = /.*/;
  assertMerge({a: re}, {}, {a: re});
  var fn = function() {};
  assertMerge({a: fn}, {}, {a: fn});
  assertMerge({a: window}, {}, {a: window});
  assertMerge({a: document}, {}, {a: document});
  assertMerge({a: document.body.firstChild}, {}, {a: document.body.firstChild});

  // If <from> property is "other", <to> property will be overwritten.
  // Even when <to> property is an array.
  assertMerge({a: null}, {a: [1]}, {a: null});
  assertMerge({a: true}, {a: [1]}, {a: true});
  assertMerge({a: false}, {a: [1]}, {a: false});
  assertMerge({a: 1}, {a: [1]}, {a: 1});
  assertMerge({a: 0}, {a: [1]}, {a: 0});
  assertMerge({a: -1}, {a: [1]}, {a: -1});
  assertMerge({a: 0.01}, {a: [1]}, {a: 0.01});
  assertMerge({a: ''}, {a: [1]}, {a: ''});
  assertMerge({a: 'brian'}, {a: [1]}, {a: 'brian'});
  assertMerge({a: 'with.dots'}, {a: [1]}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({a: d}, {a: [1]}, {a: d});
  var re = /.*/;
  assertMerge({a: re}, {a: [1]}, {a: re});
  var fn = function() {};
  assertMerge({a: fn}, {a: [1]}, {a: fn});
  assertMerge({a: window}, {a: [1]}, {a: window});
  assertMerge({a: document}, {a: [1]}, {a: document});
  assertMerge({a: document.body.firstChild}, {a: [1]},
      {a: document.body.firstChild});

  // If <from> property is "other", <to> property will be overwritten.
  // Even when <to> property is a plain object.
  assertMerge({a: null}, {a: {x: 1}}, {a: null});
  assertMerge({a: true}, {a: {x: 1}}, {a: true});
  assertMerge({a: false}, {a: {x: 1}}, {a: false});
  assertMerge({a: 1}, {a: {x: 1}}, {a: 1});
  assertMerge({a: 0}, {a: {x: 1}}, {a: 0});
  assertMerge({a: -1}, {a: {x: 1}}, {a: -1});
  assertMerge({a: 0.01}, {a: {x: 1}}, {a: 0.01});
  assertMerge({a: ''}, {a: {x: 1}}, {a: ''});
  assertMerge({a: 'brian'}, {a: {x: 1}}, {a: 'brian'});
  assertMerge({a: 'with.dots'}, {a: {x: 1}}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({a: d}, {a: {x: 1}}, {a: d});
  var re = /.*/;
  assertMerge({a: re}, {a: {x: 1}}, {a: re});
  var fn = function() {};
  assertMerge({a: fn}, {a: {x: 1}}, {a: fn});
  assertMerge({a: window}, {a: {x: 1}}, {a: window});
  assertMerge({a: document}, {a: {x: 1}}, {a: document});
  assertMerge({a: document.body.firstChild}, {a: {x: 1}},
      {a: document.body.firstChild});

  // If <from> property is "other", <to> property will be overwritten.
  // Even when <to> property is a truthy "other".
  assertMerge({a: null}, {a: true}, {a: null});
  assertMerge({a: true}, {a: 'brian'}, {a: true});
  assertMerge({a: false}, {a: 'with.dots'}, {a: false});
  assertMerge({a: 1}, {a: window}, {a: 1});
  assertMerge({a: 0}, {a: document}, {a: 0});
  assertMerge({a: -1}, {a: new Date()}, {a: -1});
  assertMerge({a: 0.01}, {a: /.*/}, {a: 0.01});
  assertMerge({a: ''}, {a: '.'}, {a: ''});
  assertMerge({a: 'brian'}, {a: 1}, {a: 'brian'});
  assertMerge({a: 'with.dots'}, {a: 2}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({a: d}, {a: ','}, {a: d});
  var re = /.*/;
  assertMerge({a: re}, {a: new Date()}, {a: re});
  var fn = function() {};
  assertMerge({a: fn}, {a: assertMerge}, {a: fn});
  assertMerge({a: window}, {a: document}, {a: window});
  assertMerge({a: document}, {a: window}, {a: document});
  assertMerge({a: document.body.firstChild}, {a: 1},
      {a: document.body.firstChild});

  // If <from> property is "other", <to> property will be overwritten.
  // Even when <to> property is a falsy "other".
  assertMerge({a: null}, {a: false}, {a: null});
  assertMerge({a: true}, {a: 0}, {a: true});
  assertMerge({a: false}, {a: ''}, {a: false});
  assertMerge({a: 1}, {a: null}, {a: 1});
  assertMerge({a: 0}, {a: null}, {a: 0});
  assertMerge({a: -1}, {a: NaN}, {a: -1});
  assertMerge({a: 0.01}, {a: 0}, {a: 0.01});
  assertMerge({a: ''}, {a: false}, {a: ''});
  assertMerge({a: 'brian'}, {a: null}, {a: 'brian'});
  assertMerge({a: 'with.dots'}, {a: ''}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({a: d}, {a: null}, {a: d});
  var re = /.*/;
  assertMerge({a: re}, {a: new Date()}, {a: re});
  var fn = function() {};
  assertMerge({a: window}, {a: 0}, {a: window});
  assertMerge({a: document}, {a: false}, {a: document});
  assertMerge({a: document.body.firstChild}, {a: null},
      {a: document.body.firstChild});

  // If <from> is an empty object, <to> should be unchanged.
  assertMerge({}, {}, {});
  assertMerge({}, {a: null}, {a: null});
  assertMerge({}, {a: true}, {a: true});
  assertMerge({}, {a: false}, {a: false});
  assertMerge({}, {a: 1}, {a: 1});
  assertMerge({}, {a: 0}, {a: 0});
  assertMerge({}, {a: -1}, {a: -1});
  assertMerge({}, {a: 0.01}, {a: 0.01});
  assertMerge({}, {a: ''}, {a: ''});
  assertMerge({}, {a: 'brian'}, {a: 'brian'});
  assertMerge({}, {a: 'with.dots'}, {a: 'with.dots'});
  var d = new Date();
  assertMerge({}, {a: d}, {a: d});
  var re = /.*/;
  assertMerge({}, {a: re}, {a: re});
  var fn = function() {};
  assertMerge({}, {a: fn}, {a: fn});
  assertMerge({}, {a: window}, {a: window});
  assertMerge({}, {a: document}, {a: document});
  assertMerge({}, {a: document.body.firstChild}, {a: document.body.firstChild});
  assertMerge({}, {a: []}, {a: []});
  assertMerge({}, {a: [1]}, {a: [1]});
  assertMerge({}, {a: [1, 2]}, {a: [1, 2]});
  assertMerge({}, {a: {x: 1}}, {a: {x: 1}});
  assertMerge({}, {a: {x: 1, y: 2}}, {a: {x: 1, y: 2}});

  // If <from> is an array, all its elements will be copied onto <to>.
  assertMerge([], [], []);
  assertMerge([1], [], [1]);
  assertMerge([1], [1], [1]);
  assertMerge([1], [2], [1]);
  assertMerge([1], [1, 2], [1, 2]);
  assertMerge([1], [2, 2], [1, 2]);
  assertMerge([1, 2], [], [1, 2]);
  assertMerge([1, 2], [1], [1, 2]);
  assertMerge([1, 2], [1, 2], [1, 2]);
  assertMerge([1, 2], [2, 2], [1, 2]);
  assertMerge([1, 2], [1, 2, 3], [1, 2, 3]);
  assertMerge([1, 2], [2, 3, 4], [1, 2, 4]);
  var from = []; from[2] = 3; from[3] = 4; from[6] = 7;
  var to = []; to[1] = 2; to[3] = 5; to[4] = 5;
  assertMerge(from, to, [undefined, 2, 3, 4, 5, undefined, 7]);
  assertMerge([[1, 2], [3, 4]], [], [[1, 2], [3, 4]]);
  assertMerge([[1, 2], [3, 4]], [true, false], [[1, 2], [3, 4]]);
  assertMerge([[1, 2], [3, 4]], [[1, 2], [1, 2]], [[1, 2], [3, 4]]);
  assertMerge([[1, 2], [3, 4]], [[1, 2, 3], [4]], [[1, 2, 3], [3, 4]]);
  assertMerge([[1, 2], [3, 4]], [[5, 5, 5], [5, 5, 5]], [[1, 2, 5], [3, 4, 5]]);

  // Test multiple levels of recursion.
  assertMerge(
      {a: {b: {c: 3}}},
      {a: {b: {d: 4}, c: {d: 5}}},
      {a: {b: {c: 3, d: 4}, c: {d: 5}}});
  assertMerge(
      {a: {b: {d: 4}, c: {d: 5}}},
      {a: {b: {c: 3}}},
      {a: {b: {c: 3, d: 4}, c: {d: 5}}});
  assertMerge(
      {a: [{b: 2, c: 3}]},
      {a: [{b: 3, c: 4, d: 5}, {b: 6, c: 7}]},
      {a: [{b: 2, c: 3, d: 5}, {b: 6, c: 7}]})
  assertMerge(
      {a: {b: [1, 2, 3]}, c: [4, 5], d: null},
      {a: {c: [1, 2, 3]}, d: [1, 2]},
      {a: {b: [1, 2, 3], c: [1, 2, 3]}, c: [4, 5], d: null});
  assertMerge(
      {a: [[[[[[[[1]]]]]]]]},
      {a: [[[[[[[[2, 3]]]]]]]]},
      {a: [[[[[[[[1, 3]]]]]]]]});
});

