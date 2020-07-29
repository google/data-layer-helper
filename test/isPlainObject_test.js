goog.module('dataLayerHelper.plain.testing.isPlainObject');
goog.setTestOnly();

const {isPlainObject} = goog.require('dataLayerHelper.plain');

describe('The `isPlainObject` method of plain', () => {
  /**
   * Ensure that plain.IsPlainObject recognizes value
   * to be a plain object iff expected is true.
   * @param {*} value The value to check
   * @param {boolean} expected If the value is a plain object.
   */
  function assertIsPlainObject(value, expected) {
    expect(isPlainObject(value)).toBe(expected);
  }

  it('identifies objects made by the constructor and dicts ' +
      'as plain objects', () => {
    assertIsPlainObject(/* value= */ {}, /* expected= */ true);
    assertIsPlainObject({a: 1}, true);
    assertIsPlainObject(Object(), true);
    assertIsPlainObject(new Object(), true);
  });

  it('identifies bools, null, and undefined as not plain objects', () => {
    assertIsPlainObject(null, false);
    assertIsPlainObject(undefined, false);
    assertIsPlainObject(true, false);
    assertIsPlainObject(false, false);
  });

  it('identifies numbers as not plain objects', () => {
    assertIsPlainObject(0, false);
    assertIsPlainObject(23, false);
    assertIsPlainObject(-23, false);
    assertIsPlainObject(0.000001, false);
    assertIsPlainObject(90001.5, false);
    assertIsPlainObject(NaN, false);
  });

  it('identifies strings as not plain objects', () => {
    assertIsPlainObject('', false);
    assertIsPlainObject('number', false);
  });

  it('identifies functions as not plain objects', () => {
    assertIsPlainObject(assertIsPlainObject, false);
    assertIsPlainObject(function() {}, false);
    assertIsPlainObject(() => {}, false);
  });

  it('identifies arrays as not plain objects', () => {
    assertIsPlainObject([], false);
    assertIsPlainObject(['number'], false);
    assertIsPlainObject(Array(), false);
    assertIsPlainObject(new Array(), false);
    assertIsPlainObject(Array('string'), false);
    assertIsPlainObject(new Array('string'), false);
    assertIsPlainObject(Object([]), false);
    assertIsPlainObject(Object(Array()), false);
  });

  it('identifies other things as not plain objects', () => {
    assertIsPlainObject(Date(), false);
    assertIsPlainObject(new Date(), false);
    assertIsPlainObject(/./, false);
    assertIsPlainObject(RegExp(), false);
    assertIsPlainObject(new RegExp(), false);
    assertIsPlainObject(window, false);
    assertIsPlainObject(document, false);
    assertIsPlainObject(document.body, false);
    assertIsPlainObject(document.body.firstChild, false);
    class Foo {}
    assertIsPlainObject(new Foo(), false);
  });

  it('does not misidentify inherited objects', () => {
    if (!Object.create) {
      Object.create = function(o) {
        class F extends o {}
        return new F();
      };
    }
    assertIsPlainObject(Object.create({}), true);
    assertIsPlainObject(Object.create({foo: 1}), false);
    assertIsPlainObject(Object.create(new Date()), false);
  });
});
