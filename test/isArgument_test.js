goog.module('datalayerhelper.helper.utils.testing.isArgument_');
goog.setTestOnly();

const {isArguments_} = goog.require('datalayerhelper.helper.utils');

describe('The `isArguments_` function of helper', () => {
  it('identifies an arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments_(arguments)).toBeTrue();
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('identifies an empty arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments_(arguments)).toBeTrue();
    };
    argumentsTest();
  });

  it('identifies Arguments object when it is an argument itself', () => {
    const argumentsTest = function() {
      argumentsAsArgTest(arguments);
    };
    const argumentsAsArgTest = (args) => {
      expect(isArguments_(args)).toBeTrue();
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('identifies an rest parameters as not an arguments object', () => {
    const restTest = (...restArgs) => {
      expect(isArguments_(...restArgs)).toBeFalse();
    };
    restTest('foo', 2, [null, null], 4);
  });

  it('identifies falsey types as not an Arguments object', () => {
    expect(isArguments_(null)).toBeFalse();
    expect(isArguments_(0)).toBeFalse();
    expect(isArguments_('')).toBeFalse();
    expect(isArguments_(undefined)).toBeFalse();
    expect(isArguments_(false)).toBeFalse();
  });

  it('identifies non-arguments objects as not Arguments objects', () => {
    expect(isArguments_([1, 2, 3])).toBeFalse();
    expect(isArguments_({'hello': 'world', 'foo': 'bar'})).toBeFalse();
    expect(isArguments_(new Object())).toBeFalse();
    expect(isArguments_(new String('test'))).toBeFalse();
    expect(isArguments_(() => {})).toBeFalse();
    expect(isArguments_(function() {})).toBeFalse();
  });

  it('identifies primitive types as not Arguments Objects', () => {
    expect(isArguments_('primitive string')).toBeFalse();
    expect(isArguments_(true)).toBeFalse();
    expect(isArguments_(1)).toBeFalse();
  });
});
