goog.module('dataLayerHelper.plain.testing.type');
goog.setTestOnly();

const {type} = goog.require('dataLayerHelper.plain');

describe('The `type` function of plain', () => {
  /**
   * Assert that plain.type identifies something as a certain type.
   * @param {?Object} value The javascript object to identify.
   * @param {string} expected The value we explect plain.type to return.
   * @param {string} context A message describing the value.
   */
  function assertType(value, expected, context) {
    expect(type(value))
        .withContext(`identifies ${context} as ${expected}`).toBe(expected);
  }

  it('identifies null and undefined', () => {
    assertType(null, 'null', 'null');
    assertType(undefined, 'undefined', 'undefined');
  });

  it('identifies booleans correctly', () => {
    assertType(true, 'boolean', 'true');
    assertType(false, 'boolean', 'false');
  });

  it('identifies floats, ints, NaNs, and Infinity as numbers', () => {
    assertType(0, 'number', 0);
    assertType(43, 'number', 'positive integers');
    assertType(-43, 'number', 'negative integers');
    assertType(0.000001, 'number', 'small decimals');
    assertType(90001.5, 'number', 'large floating-point values');
    assertType(NaN, 'number', 'NaN');
    assertType(Infinity, 'number', 'Infinity');
  });

  it('identifies any string as a string', () => {
    assertType('', 'string', 'the empty string');
    assertType('number', 'string', 'the string number');
  });

  it('identifies all functions independently of how they are constructed',
      () => {
        assertType(assertType, 'function',
            'functions in variables');
        assertType(function() {}, 'function',
            'functions made with function() syntax');
        assertType(() => {}, 'function',
            'functions made with arrow notation');
      });

  it('identifies arrays independently of how they are constructed',
      () => {
        assertType([], 'array', 'the empty array');
        assertType(['number'], 'array', 'nonempty arrays');
        assertType(Array(), 'array',
            'empty arrays made with the Array constructor');
        assertType(Array('string'), 'array',
            'nonempty arrays made with the Array constructor');
        assertType(Object([]), 'array',
            'arrays made with the object constructor');
        assertType(Object(Array()), 'array',
            'arrays made with the object and array constructor');
      });

  it('identifies dates only when made with the new Date() syntax',
      () => {
        assertType(Date(), 'string', 'dates created without new');
        assertType(new Date(), 'date', 'dates created with new');
      });

  it('identifies regex independently of how they are constructed', () => {
    assertType(/./, 'regexp',
        'regex made with / / syntax');
    assertType(RegExp(), 'regexp',
        'regex made with the RegExp constructor');
  });

  it('recognizes everything else as an object', () => {
    assertType({a: 1}, 'object', 'dictionaries');
    assertType(Object(), 'object', 'the empty object constructor');
    assertType(window, 'object', 'the window object');
    assertType(document, 'object', 'the document object');
    assertType(document.getElementsByTagName('script')[0],
        'object', 'other complex types');
  });

  it('identifies an arguments object', () => {
    const argumentsTest = () => {
      assertType(arguments, 'arguments', 'Arguments object');
    };
    argumentsTest(1, 2, 3, 4);
  });
});
