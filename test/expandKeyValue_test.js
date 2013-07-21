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
 * @fileoverview Unit tests for expandKeyValue_.
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

test('expandKeyValue_', function() {
  function assertExpand(key, value, expected) {
    deepEqual(helper.expandKeyValue_(key, value), expected);
  }

  assertExpand('a', 1, {a: 1});
  assertExpand('a', 0, {a: 0});
  assertExpand('a', -1, {a: -1});
  assertExpand('a', null, {a: null});
  assertExpand('a', undefined, {a: undefined});
  assertExpand('a', true, {a: true});
  assertExpand('a', false, {a: false});
  assertExpand('a', [], {a: []});
  assertExpand('a', ['b', {}, 3], {a: ['b', {}, 3]});
  assertExpand('a', {b: {c: 3, d: 4}}, {a: {b: {c: 3, d: 4}}});

  assertExpand('a.b', 2, {a: {b: 2}});
  assertExpand('a.b', 0, {a: {b: 0}});
  assertExpand('a.b', -2, {a: {b: -2}});
  assertExpand('a.b', null, {a: {b: null}});
  assertExpand('a.b', undefined, {a: {b: undefined}});
  assertExpand('a.b', true, {a: {b: true}});
  assertExpand('a.b', false, {a: {b: false}});
  assertExpand('a.b', [], {a: {b: []}});
  assertExpand('a.b', [[1], [2, 3]], {a: {b: [[1], [2, 3]]}});
  assertExpand('a.b', {}, {a: {b: {}}});
  assertExpand('a.b', {b: {c: false, d: 4}}, {a: {b: {b: {c: false, d: 4}}}});
  assertExpand('a.b.c.d.e.f', 6, {a: {b: {c: {d: {e: {f: 6}}}}}})

  assertExpand('', '', {'': ''});
  assertExpand('a..b', 2, {a: {'': {b: 2}}});
  assertExpand('a', {'b.c': 1}, {a: {'b.c': 1}});
  assertExpand('a.b', {'b.c': 1}, {a: {b: {'b.c': 1}}});
});

