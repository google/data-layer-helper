goog.module('dataLayerHelper.helper.utils.testing.isArguments');
goog.setTestOnly();

const {isArguments} = goog.require('dataLayerHelper.helper.utils');

describe('The `isArguments` function of helper', () => {
  it('identifies an arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments(arguments)).toBeTrue();
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('identifies an empty arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments(arguments)).toBeTrue();
    };
    argumentsTest();
  });

  it('identifies Arguments object when it is an argument itself', () => {
    const argumentsTest = function() {
      argumentsAsArgTest(arguments);
    };
    const argumentsAsArgTest = (args) => {
      expect(isArguments(args)).toBeTrue();
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('identifies an rest parameters as not an arguments object', () => {
    const restTest = (...restArgs) => {
      expect(isArguments(...restArgs)).toBeFalse();
    };
    restTest('foo', 2, [null, null], 4);
  });

  it('identifies falsey types as not an Arguments object', () => {
    expect(isArguments(null)).toBeFalse();
    expect(isArguments(0)).toBeFalse();
    expect(isArguments('')).toBeFalse();
    expect(isArguments(undefined)).toBeFalse();
    expect(isArguments(false)).toBeFalse();
  });

  it('identifies non-arguments objects as not Arguments objects', () => {
    expect(isArguments([1, 2, 3])).toBeFalse();
    expect(isArguments({'hello': 'world', 'foo': 'bar'})).toBeFalse();
    expect(isArguments(new Object())).toBeFalse();
    expect(isArguments(new String('test'))).toBeFalse();
    expect(isArguments(() => {})).toBeFalse();
    expect(isArguments(function() {})).toBeFalse();
  });

  it('identifies primitive types as not Arguments Objects', () => {
    expect(isArguments('primitive string')).toBeFalse();
    expect(isArguments(true)).toBeFalse();
    expect(isArguments(1)).toBeFalse();
  });
});
