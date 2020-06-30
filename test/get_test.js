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
 * @fileoverview Unit tests for get.
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */
goog.module('datalayerhelper.helper.testing.get');
goog.setTestOnly();

const {DataLayerHelper} = goog.require('helper');

describe('The helper.get function', function() {
  const h = new DataLayerHelper([{
    a: 1,
    b: {
      c: {
        d: 4,
      },
      e: 5,
      f: null,
    },
  }]);

  it('correctly returns the value currently assigned ' +
      'to the given key in the helper internal model', function() {
    expect(h.get('a')).toBe(1);
    expect(h.get('b')).toEqual({c: {d: 4}, e: 5, f: null});
    expect(h.get('b.c')).toEqual({d: 4});
    expect(h.get('b.c.d')).toBe(4);
    expect(h.get('b.e')).toBe(5);
    expect(h.get('b.f')).toBe(null);
  });

  it('correct returns undefined when key does not exist in model', function() {
    expect(h.get('blah')).toBe(undefined);
    expect(h.get('c')).toBe(undefined);
    expect(h.get('d')).toBe(undefined);
    expect(h.get('e')).toBe(undefined);
  });
});
