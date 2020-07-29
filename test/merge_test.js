/**
 * @fileoverview Unit tests for merge().
 * In this test file, when referring to a variable of 'other' type,
 * we mean a type which is neither an array nor a plain object.
 */
goog.module('dataLayerHelper.helper.utils.testing.merge');
goog.setTestOnly();

const {isArray, merge} = goog.require('dataLayerHelper.helper.utils');

describe('The `merge` function of helper', () => {
  /**
   * Ensure that a call to the merge function returns the
   * correct result.
   * @param {!Object} from The state to merge with
   * @param {!Object} to The inital state to merge into
   * @param {!Object} expected The expected result
   */
  function assertMerge(from, to, expected) {
    const fromCopy = isArray(from) ? [] : {};
    // Merge from into fromCopy.
    jQuery.extend(true, fromCopy, from);
    merge(from, to);

    expect(from).toEqual(fromCopy);
    expect(to).toEqual(expected);
  }

  it('overwrites `other` type objects when merging with an array', () => {
    assertMerge(/* from= */ {a: []}, /* to= */ {}, /* expected= */ {a: []});
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
  });

  it('merges arrays with the same key together', () => {
    assertMerge({a: []}, {a: []}, {a: []});
    assertMerge({a: []}, {a: [1]}, {a: [1]});
    assertMerge({a: []}, {a: [undefined, 2]}, {a: [undefined, 2]});
    assertMerge({a: [1]}, {a: [undefined, 2]}, {a: [1, 2]});
    assertMerge({a: [1, 2]}, {a: [undefined, 2]}, {a: [1, 2]});
    assertMerge({a: [1, 2, 3]}, {a: [undefined, 2]}, {a: [1, 2, 3]});
    assertMerge({a: [1, 3, 3]}, {a: [undefined, 2]}, {a: [1, 3, 3]});
    assertMerge({a: [1, 2, 3]}, {a: []}, {a: [1, 2, 3]});
  });

  it('prevents merging arrays if the `_clear` flag is true', () => {
    assertMerge({a: [], _clear: true}, {a: []}, {a: []});
    assertMerge({a: [], _clear: true}, {a: [1]}, {a: []});
    assertMerge({a: [], _clear: true}, {a: [undefined, 2]}, {a: []});
    assertMerge({a: [1], _clear: true}, {a: [undefined, 2]}, {a: [1]});
  });

  it('overwrites `other` type objects when merging with a plain object', () => {
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
  });

  it('prevents merging objects if the `_clear` flag is true', () => {
    assertMerge({a: {}, _clear: true}, {a: {}}, {a: {}});
    assertMerge({a: {}, _clear: true}, {a: {x: 1}}, {a: {}});
    assertMerge({a: {}, _clear: true}, {a: {x: undefined, y: 2}}, {a: {}});
    assertMerge({a: {x: 1}, _clear: true}, {a: {x: undefined, y: 2}},
        {a: {x: 1}});
  });

  it('merges plain objects with the same key together', () => {
    assertMerge({a: {}}, {a: {}}, {a: {}});
    assertMerge({a: {}}, {a: {x: 1}}, {a: {x: 1}});
    assertMerge({a: {}}, {a: {x: undefined, y: 2}}, {a: {x: undefined, y: 2}});
    assertMerge({a: {x: 1}}, {a: {x: undefined, y: 2}}, {a: {x: 1, y: 2}});
    assertMerge({a: {x: 1}}, {a: {x: undefined, y: 2}}, {a: {x: 1, y: 2}});
    assertMerge({a: {x: 1, y: 2}}, {a: {x: undefined, y: 2}},
        {a: {x: 1, y: 2}});
    assertMerge({a: {x: 1, y: 2, z: 3}}, {a: {x: undefined, y: 2}},
        {a: {x: 1, y: 2, z: 3}});
    assertMerge({a: {x: 1, y: 3, z: 3}}, {a: {x: undefined, y: 2}},
        {a: {x: 1, y: 3, z: 3}});
    assertMerge({a: {x: 1, y: 2, z: 3}}, {a: {}}, {a: {x: 1, y: 2, z: 3}});
  });

  it('creates a new property if an `other` type object is inserted with' +
      'a new key', () => {
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
    const d = new Date();
    assertMerge({a: d}, {}, {a: d});
    const re = /.*/;
    assertMerge({a: re}, {}, {a: re});
    const fn = function() {};
    assertMerge({a: fn}, {}, {a: fn});
    assertMerge({a: window}, {}, {a: window});
    assertMerge({a: document}, {}, {a: document});
    assertMerge({a: document.body.firstChild}, {},
        {a: document.body.firstChild});
  });

  it('overwrites arrays if the object to merge in is an `other` type object',
      () => {
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
        const d = new Date();
        assertMerge({a: d}, {a: [1]}, {a: d});
        const re = /.*/;
        assertMerge({a: re}, {a: [1]}, {a: re});
        const fn = () => {};
        assertMerge({a: fn}, {a: [1]}, {a: fn});
        assertMerge({a: window}, {a: [1]}, {a: window});
        assertMerge({a: document}, {a: [1]}, {a: document});
        assertMerge({a: document.body.firstChild}, {a: [1]},
            {a: document.body.firstChild});
      });

  it('overwrites plain objects if the object to merge in is an `other` ' +
      'type object', () => {
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
    const d = new Date();
    assertMerge({a: d}, {a: {x: 1}}, {a: d});
    const re = /.*/;
    assertMerge({a: re}, {a: {x: 1}}, {a: re});
    const fn = () => {};
    assertMerge({a: fn}, {a: {x: 1}}, {a: fn});
    assertMerge({a: window}, {a: {x: 1}}, {a: window});
    assertMerge({a: document}, {a: {x: 1}}, {a: document});
    assertMerge({a: document.body.firstChild}, {a: {x: 1}},
        {a: document.body.firstChild});
  });

  it('overwrites truthy other objects if the object to merge is an `other`' +
      'object', () => {
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
    const d = new Date();
    assertMerge({a: d}, {a: ','}, {a: d});
    const re = /.*/;
    assertMerge({a: re}, {a: new Date()}, {a: re});
    const fn = () => {};
    assertMerge({a: fn}, {a: assertMerge}, {a: fn});
    assertMerge({a: window}, {a: document}, {a: window});
    assertMerge({a: document}, {a: window}, {a: document});
    assertMerge({a: document.body.firstChild}, {a: 1},
        {a: document.body.firstChild});
  });

  it('overwrites falsy other objects if the object to merge is an `other`' +
      'object', () => {
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
    const d = new Date();
    assertMerge({a: d}, {a: null}, {a: d});
    const re = /.*/;
    assertMerge({a: re}, {a: new Date()}, {a: re});
    assertMerge({a: window}, {a: 0}, {a: window});
    assertMerge({a: document}, {a: false}, {a: document});
    assertMerge({a: document.body.firstChild}, {a: null},
        {a: document.body.firstChild});
  });

  it('does not change existing values when merging with an empty object',
      () => {
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
        const d = new Date();
        assertMerge({}, {a: d}, {a: d});
        const re = /.*/;
        assertMerge({}, {a: re}, {a: re});
        const fn = function() {};
        assertMerge({}, {a: fn}, {a: fn});
        assertMerge({}, {a: window}, {a: window});
        assertMerge({}, {a: document}, {a: document});
        assertMerge({}, {a: document.body.firstChild},
            {a: document.body.firstChild});
        assertMerge({}, {a: []}, {a: []});
        assertMerge({}, {a: [1]}, {a: [1]});
        assertMerge({}, {a: [1, 2]}, {a: [1, 2]});
        assertMerge({}, {a: {x: 1}}, {a: {x: 1}});
        assertMerge({}, {a: {x: 1, y: 2}}, {a: {x: 1, y: 2}});
      });

  it('copies all objects from an array to an existing array', () => {
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
    const from = [];
    from[2] = 3;
    from[3] = 4;
    from[6] = 7;
    const to = [];
    to[1] = 2;
    to[3] = 5;
    to[4] = 5;
    assertMerge(from, to, [undefined, 2, 3, 4, 5, undefined, 7]);
    const from2 = [undefined, undefined, 3, 4, undefined, undefined, 7];
    const to2 = [undefined, 2, undefined, 5, 5];
    assertMerge(from2, to2, from2);
    assertMerge([[1, 2], [3, 4]], [], [[1, 2], [3, 4]]);
    assertMerge([[1, 2], [3, 4]], [true, false], [[1, 2], [3, 4]]);
    assertMerge([[1, 2], [3, 4]], [[1, 2], [1, 2]], [[1, 2], [3, 4]]);
    assertMerge([[1, 2], [3, 4]], [[1, 2, 3], [4]], [[1, 2, 3], [3, 4]]);
    assertMerge([[1, 2], [3, 4]], [[5, 5, 5], [5, 5, 5]],
        [[1, 2, 5], [3, 4, 5]]);
  });

  it('has consistent merge behavior even for deeply nested objects or arrays',
      () => {
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
            {a: [{b: 2, c: 3, d: 5}, {b: 6, c: 7}]});
        assertMerge(
            {a: {b: [1, 2, 3]}, c: [4, 5], d: null},
            {a: {c: [1, 2, 3]}, d: [1, 2]},
            {a: {b: [1, 2, 3], c: [1, 2, 3]}, c: [4, 5], d: null});
        assertMerge(
            {a: [[[[[[[[1]]]]]]]]},
            {a: [[[[[[[[2, 3]]]]]]]]},
            {a: [[[[[[[[1, 3]]]]]]]]});
      });

  it('prevents merge when `_clear` flag is true ' +
      'even for deeply nested objects or arrays',
      () => {
        assertMerge(
            {a: {b: {c: 3}}, _clear: true},
            {a: {b: {d: 4}, c: {d: 5}}},
            {a: {b: {c: 3}}});
        assertMerge(
            {a: {b: {d: 4}, c: {d: 5}}, _clear: true},
            {a: {b: {c: 3}}},
            {a: {b: {d: 4}, c: {d: 5}}});
        assertMerge(
            {a: [{b: 2, c: 3}], _clear: true},
            {a: [{b: 3, c: 4, d: 5}, {b: 6, c: 7}]},
            {a: [{b: 2, c: 3}]});
        assertMerge(
            {a: {b: [1, 2, 3]}, c: [4, 5], d: null, _clear: true},
            {a: {c: [1, 2, 3]}, d: [1, 2]},
            {a: {b: [1, 2, 3]}, c: [4, 5], d: null});
        assertMerge(
            {a: [[[[[[[[1]]]]]]]], _clear: true},
            {a: [[[[[[[[2, 3]]]]]]]]},
            {a: [[[[[[[[1]]]]]]]]});
      });

  it('prevents merge when `_clear` flag is true' +
      'deeper in nested objects or arrays',
      () => {
        assertMerge(
            {a: {b: {c: 3}, _clear: true}},
            {a: {b: {d: 4}, c: {d: 5}}},
            {a: {b: {c: 3}, c: {d: 5}}});
        assertMerge(
            {a: {b: [[[[[[[[1]]]]]]]], _clear: true}, c: [[[1]]]},
            {a: {b: [[[[[[[[2, 3]]]]]]]]}, c: [[[2, 3]]]},
            {a: {b: [[[[[[[[1]]]]]]]]}, c: [[[1, 3]]]});
      });

  it('prevents merging when the `_clear` flag is truthy', () => {
    assertMerge({a: {}, _clear: 1}, {a: {x: 1}}, {a: {}});
    assertMerge({a: {}, _clear: 'example'}, {a: {x: 1}}, {a: {}});
    assertMerge({a: {}, _clear: {}}, {a: {x: 1}}, {a: {}});
    assertMerge({a: {}, _clear: []}, {a: {x: 1}}, {a: {}});
  });

  it('merges when the `_clear` flag is falsy', () => {
    assertMerge({a: {}, _clear: false}, {a: {x: 1}}, {a: {x: 1}});
    assertMerge({a: {}, _clear: null}, {a: {x: 1}}, {a: {x: 1}});
    assertMerge({a: {}, _clear: 0}, {a: {x: 1}}, {a: {x: 1}});
    assertMerge({a: {}, _clear: ''}, {a: {x: 1}}, {a: {x: 1}});
  });
});
