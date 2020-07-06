goog.require('helper');

describe('The helper.isArguments_ function', () => {
  it('Identifies an arguments object', () => {
    const argumentsTest = function() {
      expect(helper.isArguments_(arguments)).toBe(true);
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('Identifies an empty arguments object', () => {
    const argumentsTest = function() {
      expect(helper.isArguments_(arguments)).toBe(true);
    };
    argumentsTest();
  });

  it('Identifies Arguments object when it is an argument itself', () => {
    const argumentsTest = function() {
      argumentsAsArgTest(arguments);
    };
    const argumentsAsArgTest = (args) => {
      expect(helper.isArguments_(args)).toBe(true);
    };
    argumentsTest(1, 2, 3, 4);
  });

  it('Identifies an rest parameters as not an arguments object', () => {
    const restTest = (...restArgs) => {
      expect(helper.isArguments_(...restArgs)).toBe(false);
    };
    restTest('foo', 2, [null, null], 4);
  });

  it('Identifies falsey types as not an Arguments object', () => {
    expect(helper.isArguments_(null)).toBe(false);
    expect(helper.isArguments_(0)).toBe(false);
    expect(helper.isArguments_('')).toBe(false);
    expect(helper.isArguments_(undefined)).toBe(false);
    expect(helper.isArguments_(false)).toBe(false);
  });

  it('Identifies non-arguments objects as not Arguments objects', () => {
    expect(helper.isArguments_([1, 2, 3])).toBe(false);
    expect(helper.isArguments_({'hello': 'world', 'foo': 'bar'})).toBe(false);
    expect(helper.isArguments_(new Object())).toBe(false);
    expect(helper.isArguments_(new String('test'))).toBe(false);
    expect(helper.isArguments_(() => {})).toBe(false);
    expect(helper.isArguments_(function() {})).toBe(false);
  });

  it('Identifies primitive types as not Arguments Objects', () => {
    expect(helper.isArguments_('primitive string')).toBe(false);
    expect(helper.isArguments_(true)).toBe(false);
    expect(helper.isArguments_(1)).toBe(false);
  });
});
