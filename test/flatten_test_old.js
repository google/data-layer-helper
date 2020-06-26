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
 * @fileoverview Unit tests for flatten().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

test('flatten', function() {

  var dataLayer = [{a: 1, b: {c: {d: 4}, e: 5}}];
  dataLayer.push({f: 6});
  dataLayer.push({g: 7});

  var h = new helper.DataLayerHelper(dataLayer);
  dataLayer.push({g: 8, i: 9});
  dataLayer.push({'b.c': 3});

  deepEqual([
    {a: 1, b: {c: {d: 4}, e: 5}},
    {f: 6},
    {g: 7},
    {g: 8, i: 9},
    {'b.c': 3}
  ], dataLayer);

  h.flatten();

  deepEqual([{
    a: 1,
    b: {c: 3, e: 5},
    f: 6,
    g: 8,
    i: 9
  }], dataLayer);

  h.flatten();

  deepEqual([{
    a: 1,
    b: {c: 3, e: 5},
    f: 6,
    g: 8,
    i: 9
  }], dataLayer);

  dataLayer.push({f: 7, j: 10});

  deepEqual([
    {
      a: 1,
      b: {c: 3, e: 5},
      f: 6,
      g: 8,
      i: 9
    },
    {
      f: 7,
      j: 10
    }
  ], dataLayer);

  h.flatten();

  deepEqual([{
    a: 1,
    b: {c: 3, e: 5},
    f: 7,
    g: 8,
    i: 9,
    j: 10
  }], dataLayer);

});

