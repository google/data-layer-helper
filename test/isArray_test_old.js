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
 * @fileoverview Unit tests for isArray_().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

test('isArray_', function() {
  function assertIsArray(value, expected) {
    equal(helper.isArray_(value), expected);
  }

  assertIsArray(23, false);
  assertIsArray(NaN, false);
  assertIsArray(true, false);
  assertIsArray(false, false);
  assertIsArray(null, false);
  assertIsArray(undefined, false);
  assertIsArray('string', false)
  assertIsArray({a: 1}, false);
  assertIsArray(function() {}, false);
  assertIsArray(arguments, false);
  assertIsArray(window, false);
  assertIsArray(Array, false);

  assertIsArray([], true);
  assertIsArray([false], true);
  assertIsArray(Array(), true);
  assertIsArray(Array(false), true);
  assertIsArray(Object([]), true);
  assertIsArray(Object(Array()), true);
});

test('isArray_fromAnotherWindow', function() {
  var iframe = document.createElement('iframe');
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
  var doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.write('<scr'+'ipt>var x = ["hello"];</scr'+'ipt>')

  var x = iframe.contentWindow.x;
  ok(x[0] === 'hello');
  ok([] instanceof Array === true);
  ok(x instanceof Array === false);
  ok(helper.isArray_([]) === true);
  ok(helper.isArray_(x) === true);
});
