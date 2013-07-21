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
 * @fileoverview Unit tests for isPlainObject().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

function assertIsPlainObject(value, expected) {
  equal(plain.isPlainObject(value), expected);
}

test('isPlainObject', function() {
  assertIsPlainObject(null, false);
  assertIsPlainObject(undefined, false);
  assertIsPlainObject(true, false);
  assertIsPlainObject(false, false);
  assertIsPlainObject(0, false);
  assertIsPlainObject(23, false);
  assertIsPlainObject(-23, false);
  assertIsPlainObject(0.000001, false);
  assertIsPlainObject(90001.5, false);
  assertIsPlainObject(NaN, false);
  assertIsPlainObject('', false);
  assertIsPlainObject('number', false);
  assertIsPlainObject(assertIsPlainObject, false);
  assertIsPlainObject(function() {}, false);
  assertIsPlainObject([], false);
  assertIsPlainObject(['number'], false);
  assertIsPlainObject(Array(), false);
  assertIsPlainObject(new Array(), false);
  assertIsPlainObject(Array('string'), false);
  assertIsPlainObject(new Array('string'), false);
  assertIsPlainObject(Object([]), false);
  assertIsPlainObject(Object(Array()), false);
  assertIsPlainObject(Date(), false);
  assertIsPlainObject(new Date(), false);
  assertIsPlainObject(/./, false);
  assertIsPlainObject(RegExp(), false);
  assertIsPlainObject(new RegExp(), false);
  assertIsPlainObject(window, false);
  assertIsPlainObject(document, false);
  assertIsPlainObject(document.body, false);
  assertIsPlainObject(document.body.firstChild, false);
  assertIsPlainObject({}, true);
  assertIsPlainObject({a: 1}, true);
  assertIsPlainObject(Object(), true);
  assertIsPlainObject(new Object(), true);
  function Foo() {}
  assertIsPlainObject(new Foo(), false);
});

test('isPlainObject_inherited', function() {
  if (!Object.create) {
    Object.create = function(o) {
      if (arguments.length != 1) {
        throw new Error('Object.create requires one parameter.');
      }
      function F() {}
      F.prototype = o;
      return new F();
    };
  }
  assertIsPlainObject(Object.create({}), true);
  assertIsPlainObject(Object.create({foo: 1}), false);
  assertIsPlainObject(Object.create(new Date()), false);
});

