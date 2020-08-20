goog.module('dataLayerHelper.helper.testing.process');
goog.setTestOnly();

const DataLayerHelper = goog.require('dataLayerHelper.helper.DataLayerHelper');

describe('The `process` function of helper', () => {
  let dataLayer;
  let helper;

  beforeEach(() => {
    dataLayer = [{one: 1}];
    helper = new DataLayerHelper(dataLayer,
        {processNow: false});
  });

  it('processes the existing dataLayer', () => {
    expect(helper.get('one')).toBe(undefined);

    helper.process();

    expect(helper.get('one')).toBe(1);
  });

  it('processes messages that were pushed while awaiting processing', () => {
    dataLayer.push({two: 2});

    expect(helper.get('two')).toBe(undefined);

    helper.process();

    expect(helper.get('one')).toBe(1);
    expect(helper.get('two')).toBe(2);
  });

  it('marks processed as true', () => {
    expect(helper.processed_).toBe(false);

    helper.process();

    expect(helper.processed_).toBe(true);
  });

  describe('with the built in set command', function() {
    let commandAPI;
    beforeEach(() => {
      commandAPI = function() {
        dataLayer.push(arguments);
      };
    });

    it('registers set commands pushed before process', () => {
      commandAPI('set', 'two', 2);
      helper.process();

      expect(helper.get('two')).toBe(2);
    });

    it('registers set commands pushed before process in other ' +
      'commands pushed before process', () => {
      commandAPI('set', 'two', 2);
      commandAPI('event');
      helper.registerProcessor('event', function() {
        return {'two': this.get('two') + 3};
      });
      helper.process();

      expect(helper.get('two')).toBe(5);
    });

    it('registers set commands pushed after process', () => {
      helper.process();
      commandAPI('set', 'two', 2);

      expect(helper.get('two')).toBe(2);
    });
  });
});
