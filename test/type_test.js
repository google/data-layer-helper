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
 * @fileoverview Unit tests for type().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

test("type", function() {

  function assertType(value, expected) {
    equal(plain.type(value), expected);
  }

  assertType(null, 'null');
  assertType(undefined, 'undefined');

  assertType(true, 'boolean');
  assertType(false, 'boolean');

  assertType(0, 'number');
  assertType(23, 'number');
  assertType(-23, 'number');
  assertType(0.000001, 'number');
  assertType(90001.5, 'number');
  assertType(NaN, 'number');
  assertType(Infinity, 'number');

  assertType('', 'string');
  assertType('number', 'string');

  assertType(assertType, 'function');
  assertType(function() {}, 'function');

  assertType([], 'array');
  assertType(['number'], 'array');
  assertType(Array(), 'array');
  assertType(Array('string'), 'array');
  assertType(Object([]), 'array');
  assertType(Object(Array()), 'array');

  assertType(Date(), 'string');
  assertType(new Date(), 'date');

  assertType(/./, 'regexp');
  assertType(RegExp(), 'regexp');

  assertType({a: 1}, 'object');
  assertType(Object(), 'object');
  assertType(window, 'object');
  assertType(document, 'object');
  assertType(document.getElementsByTagName('script')[0], 'object');
});

