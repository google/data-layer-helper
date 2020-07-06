goog.module('datalayerhelper.helper.testing.isArgument_');
goog.setTestOnly();

const {isArguments_} = goog.require('helper');

describe('The isArguments_ function', () => {
  it('Identifies an arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments_(arguments)).toBe(true);
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('Identifies an empty arguments object', () => {
    const argumentsTest = function() {
      expect(isArguments_(arguments)).toBe(true);
    };
    argumentsTest();
  });

  it('Identifies Arguments object when it is an argument itself', () => {
    const argumentsTest = function() {
      argumentsAsArgTest(arguments);
    };
    const argumentsAsArgTest = (args) => {
      expect(isArguments_(args)).toBe(true);
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('Identifies an rest parameters as not an arguments object', () => {
    const restTest = (...restArgs) => {
      expect(isArguments_(...restArgs)).toBe(false);
    };
    restTest('foo', 2, [null, null], 4);
  });

  it('Identifies falsey types as not an Arguments object', () => {
    expect(isArguments_(null)).toBe(false);
    expect(isArguments_(0)).toBe(false);
    expect(isArguments_('')).toBe(false);
    expect(isArguments_(undefined)).toBe(false);
    expect(isArguments_(false)).toBe(false);
  });

  it('Identifies non-arguments objects as not Arguments objects', () => {
    expect(isArguments_([1, 2, 3])).toBe(false);
    expect(isArguments_({'hello': 'world', 'foo': 'bar'})).toBe(false);
    expect(isArguments_(new Object())).toBe(false);
    expect(isArguments_(new String('test'))).toBe(false);
    expect(isArguments_(() => {})).toBe(false);
    expect(isArguments_(function() {})).toBe(false);
  });

  it('Identifies primitive types as not Arguments Objects', () => {
    expect(isArguments_('primitive string')).toBe(false);
    expect(isArguments_(true)).toBe(false);
    expect(isArguments_(1)).toBe(false);
  });
});
