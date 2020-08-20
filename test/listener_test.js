goog.module('dataLayerHelper.helper.testing.listener');
goog.setTestOnly();

const DataLayerHelper = goog.require('dataLayerHelper.helper.DataLayerHelper');

describe('The helper when listening to the past', () => {
  let dataLayer;
  let callCount = 0;
  // Create a listener expecting certain calls. We can't just use a
  // jasmine spy since the first argument is the model, which mutates
  // constantly.
  const listenerExpecting = (calls, operation = () => {}) => {
    function checkArgsAndRun(model, message) {
      // objectContaining call ensures that the arguments object
      // can match an array.
      expect(arguments).toEqual(jasmine.objectContaining(calls[callCount++]));
      operation(model, message);
    }
    return checkArgsAndRun;
  };
  beforeEach(() => {
    dataLayer = [];
    callCount = 0;
  });

  describe('when pushing functions with no model side effects', () => {
    it('does not call the listener if nothing is pushed', () => {
      new DataLayerHelper(dataLayer,
        {listenToPast: true, listener: listenerExpecting([])});

      expect(dataLayer.length).toBe(0);
    });


    it('calls the listener with the right model state when pushed after ' +
      'being constructed.', () => {
      new DataLayerHelper(dataLayer, {listenToPast: true,
          listener: listenerExpecting(
            [[{a: 1}, {a: 1}], [{a: 1, b: 1}, {b: 1}]])});
      dataLayer.push({a: 1});
      dataLayer.push({b: 1});

      expect(dataLayer.length).toBe(2);
    });

    it('calls the listener with the right model state when pushed in ' +
      'the past.', () => {
      dataLayer.push({a: 1});
      dataLayer.push({b: 1});
      new DataLayerHelper(dataLayer, {listenToPast: true,
          listener: listenerExpecting(
            [[{a: 1}, {a: 1}], [{a: 1, b: 1}, {b: 1}]])});

      expect(dataLayer.length).toBe(2);
    });
  });

  describe('when pushing functions with model side effects', () => {
    // It's not recommended to push to the model inside of a listener
    // function since it can mess up public history, but ideally it should not
    // break anything if you are using a single data layer helper.
    it('Can recursively push to the model', () => {
      dataLayer.push({a: 1});
      const listenFunction = (model, message) => {
        if (model.a < 3) {
          dataLayer.push({a: model.a + 1});
        }
      };
      new DataLayerHelper(dataLayer, {listenToPast: true,
        listener: listenerExpecting(
            [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}], [{a: 3}, {a: 3}]],
            listenFunction)});
    });

    it('Can recursively push to the model with more than 1 element on ' +
      'the datalayer queue.', () => {
      dataLayer.push({a: 1});
      dataLayer.push({b: 2});
      const listenFunction = (model, message) => {
        if (model.a < 3) {
          dataLayer.push({a: model.a + 1});
        }
      };
      new DataLayerHelper(dataLayer, {listenToPast: true,
        listener: listenerExpecting(
            [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}], [{a: 3}, {a: 3}],
              [{a: 3, b: 2}, {b: 2}]],
            listenFunction)});
      // Public history is broken now - this helper sees {a: 1}, {a: 2}, {a: 3}
      // {b: 2}, but the data layer sees {a: 1}, {b:2}, {a: 2}, {a: 3}. This
      // can't be resolved. https://github.com/google/data-layer-helper/pull/59
      expect(dataLayer).toEqual(
          jasmine.objectContaining([{a: 1}, {b: 2}, {a: 2}, {a: 3}]));
    });
  });
});

