goog.module('dataLayerHelper.plain.testing.hasOwn');
goog.setTestOnly();

const {hasOwn} = goog.require('dataLayerHelper.plain');

describe('The `hasOwn` method of plain', () => {
  /**
   * Helper function used to ensure that plain.hasOwn determines if
   * the value has a non-inherited property with the given key.
   * @param {*} value The value to check.
   * @param {string} key The property name.
   * @param {boolean} expected If the value has a property named by key.
   */
  function assertHasOwn(value, key, expected) {
    expect(hasOwn(value, key)).toBe(expected);
  }

  it('recognizes simple type to not have properties', () => {
    assertHasOwn(/* value= */ 23, /* key= */ 'valueOf', /* expected= */false);
    assertHasOwn(NaN, 'valueOf', false);
    assertHasOwn(true, 'valueOf', false);
    assertHasOwn(false, 'valueOf', false);
    assertHasOwn(null, 'valueOf', false);
    assertHasOwn(undefined, 'valueOf', false);
  });

  it('recognizes string properties', () => {
    assertHasOwn('string', 'length', true);
    assertHasOwn('string', 'size', false);

    expect(!!'string'['split']).toBe(true);
    assertHasOwn('string', 'split', false);
  });

  it('recognizes array properties', () => {
    assertHasOwn([1, 2], '0', true);
    assertHasOwn([1, 2], '1', true);
    assertHasOwn([1, 2], '2', false);
    assertHasOwn([1, 2], '3', false);

    expect(!!([1, 2])['join']).toBe(true);
    assertHasOwn([1, 2], 'join', false);
  });

  it('recognizes Object properties', () => {
    assertHasOwn({a: 1}, '0', false);
    assertHasOwn({a: 1}, '1', false);
    assertHasOwn({a: 1}, 'a', true);
    assertHasOwn({a: 1}, 'valueOf', false);
    assertHasOwn({a: 1}, 'constructor', false);
  });

  it('recognizes function properties', () => {
    const fn = () => {};
    assertHasOwn(fn, 'constructor', false);
    assertHasOwn(fn, 'valueOf', false);
  });
});
