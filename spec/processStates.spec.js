goog.require('helper');

describe('The processStates function', function() {
  /**
   * Asserts that calling processStates_ with the given arguments will result
   * in the expected model state and expected calls to the listener.
   *
   * @param {Array.<Object>} states The states argument for the call to
   *     processStates_.
   * @param {Object} expectedModel The expected model state after the call.
   * @param {Array.<Array.<*>>} expectedListenerCalls The expected calls made
   *     to the helper's listener. Should be an array of arrays where each sub-
   *     array represents the arguments passed to the listener during a call.
   */
  function assertProcessStates(states, expectedModel, expectedListenerCalls) {
    let MockHelper = function() {
      this.model_ = {};
      this.unprocessed_ = [];
      this.executingListener_ = false;
      this.listenerCalls_ = [];
      this.listener_ = function() {
        this.listenerCalls_.push(
            jQuery.extend(true, [], [].slice.call(arguments, 0)));
      };
      this.abstractModelInterface_ = helper.buildAbstractModelInterface_(this);
    };
    function doAssert(skipListener) {
      MockHelper.prototype = new DataLayerHelper([]);
      let helper = new MockHelper();
      DataLayerHelper.prototype.processStates_.call(helper, states, skipListener);
      expect(helper.model_).toEqual( expectedModel);
      expect(helper.listenerCalls_).toEqual(skipListener ? [] : expectedListenerCalls);
      expect(helper.unprocessed_).toEqual([]);
      expect(helper.executingListener_).toEqual(false);
    }
    doAssert(true);
    doAssert(false);
  }

  describe('The behavior of process states', function() {
    it('does nothing with no states or model', function () {
      assertProcessStates([], {}, []);
    });

    it('makes a call when a single state needs to be processed', function () {
      assertProcessStates([{a: 1}], {a: 1}, [[{a: 1}, {a: 1}]]);
    });

    it('makes two calls when two states needs to be processed', function () {
      assertProcessStates([{a: 1}, {a: 2}], {a: 2},
          [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}]]);
    });

    it('makes calls with nested state arguments', function () {
      assertProcessStates([{'a.b': 1}], {a: {b: 1}},
          [[{a: {b: 1}}, {'a.b': 1}]]);
    });
  });

  describe('The behavior while using a custom setter method', function() {
    let customMethod = function() { this.set('a', 1); };

    it('makes an overridding setter call', function () {
      assertProcessStates(
          [{a: 0}, customMethod],
          {a: 1},
          [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);
    });

    it('makes an overridding setter call', function () {
      assertProcessStates(
          [{a: 0}, customMethod],
          {a: 1},
          [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);
    });

  });


});
