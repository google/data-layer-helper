goog.require('helper');

describe('The helper.isArguments_ function', function() {

  it('Identifies an arguments object', function() {
      const argumentsTest = () => {
        expect(helper.isArguments_(arguments)).toBe(true);
      };
      argumentsTest(1, 2, 3, 4);
  });

  it('Identifies an Arguments object when it is an argument itself', function() {
      const argumentsTest = () => {
          argumentsAsArgTest(arguments);
      }
      const argumentsAsArgTest = (args) => {
        expect(helper.isArguments_(args)).toBe(true);
      };
      argumentsTest(1, 2, 3, 4);
  });

  it('Identifies null as not an Arguments object', function() {
    expect(helper.isArguments_(null)).toBe(false);
  });

  it('Identifies an array as not an Arguments object', function() {
    expect(helper.isArguments_([1, 2, 3])).toBe(false);
  });

  it('Identifies a function as not an Arguments object', function() {
    expect(helper.isArguments_(() => {})).toBe(false);
  });

});
