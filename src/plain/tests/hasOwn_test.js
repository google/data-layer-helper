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
 * @fileoverview Unit tests for plain.hasOwn.
 */

goog.require('goog.testing.jsunit');
goog.require('plain');

function testHasOwn() {
  function assertHasOwn(value, key, expected) {
    assertEquals(expected, plain.hasOwn(value, key));
  }

  assertHasOwn(23, 'valueOf', false);
  assertHasOwn(NaN, 'valueOf', false);
  assertHasOwn(true, 'valueOf', false);
  assertHasOwn(false, 'valueOf', false);
  assertHasOwn(null, 'valueOf', false);
  assertHasOwn(undefined, 'valueOf', false);

  assertHasOwn('string', 'length', true);
  assertHasOwn('string', 'size', false);
  assert(!!'string'['split']);
  assertHasOwn('string', 'split', false);

  assertHasOwn([1, 2], '0', true);
  assertHasOwn([1, 2], '1', true);
  assertHasOwn([1, 2], '2', false);
  assertHasOwn([1, 2], '3', false);
  assert(!!([1, 2])['join']);
  assertHasOwn([1, 2], 'join', false);

  assertHasOwn({a: 1}, '0', false);
  assertHasOwn({a: 1}, '1', false);
  assertHasOwn({a: 1}, 'a', true);
  assertHasOwn({a: 1}, 'valueOf', false);
  assertHasOwn({a: 1}, 'constructor', false);

  var fn = function() {};
  assertHasOwn(fn, 'caller', true);
  assertHasOwn(fn, 'arguments', true);
  assertHasOwn(fn, 'constructor', false);
  assertHasOwn(fn, 'valueOf', false);
}

