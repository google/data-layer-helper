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
      DataLayerHelper.prototype.processStates_.call(helper, states,
          skipListener);
      expect(helper.model_).toEqual(expectedModel);
      expect(helper.listenerCalls_).
          toEqual(skipListener ? [] : expectedListenerCalls);
      expect(helper.unprocessed_).toEqual([]);
      expect(helper.executingListener_).toEqual(false);
    }

    doAssert(true);
    doAssert(false);
  }

  describe('The behavior of process states', function() {
    it('does nothing with no states or model', function() {
      assertProcessStates([], {}, []);
    });

    it('makes a call when a single state needs to be processed', function() {
      assertProcessStates([{a: 1}], {a: 1}, [[{a: 1}, {a: 1}]]);
    });

    it('makes two calls when two states needs to be processed', function() {
      assertProcessStates([{a: 1}, {a: 2}], {a: 2},
          [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}]]);
    });

    it('makes calls with nested state arguments', function() {
      assertProcessStates([{'a.b': 1}], {a: {b: 1}},
          [[{a: {b: 1}}, {'a.b': 1}]]);
    });
  });

  describe('The behavior with custom setter methods', function() {
    it('makes an overridding setter call', function() {
      let customMethod = function() {
        this.set('a', 1);
      };
      assertProcessStates(
          [{a: 0}, customMethod],
          {a: 1},
          [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);
    });

    it('makes a setter call on empty state', function() {
      let customMethod = function() {
        this.set('b', 'one');
      };
      assertProcessStates(
          [customMethod],
          {b: 'one'},
          [[{b: 'one'}, customMethod]]);
    });

    it('makes a setter call on a complex nested object', function() {
      let customMethod = function() {
        this.set('c.d', [3]);
      };
      assertProcessStates(
          [customMethod],
          {c: {d: [3]}},
          [[{c: {d: [3]}}, customMethod]]);
    });

    it('maintains state when calling custom methods', function() {
      let customMethod = function() {
        let a = this.get('a');
        expect(a).toEqual(1);
      };
      assertProcessStates(
          [{a: 1, b: 2}, customMethod],
          {a: 1, b: 2},
          [
            [{a: 1, b: 2}, {a: 1, b: 2}],
            [{a: 1, b: 2}, customMethod],
          ]);
    });

    it('maintains nested state when calling custom methods', function() {
      let customMethod = function() {
        let b = this.get('a.b');
        expect(b).toEqual(2);
      };
      assertProcessStates(
          [{a: {b: 2}}, customMethod],
          {a: {b: 2}},
          [
            [{a: {b: 2}}, {a: {b: 2}}],
            [{a: {b: 2}}, customMethod],
          ]);
    });

    it('maintains complex, deeply nested state when calling custom methods',
        function() {
          let customMethod = function() {
            let a = this.get('a');
            expect(a.b.c[0]).toEqual(3);
          };
          assertProcessStates(
              [{a: {b: {c: [3]}}}, customMethod],
              {a: {b: {c: [3]}}},
              [
                [{a: {b: {c: [3]}}}, {a: {b: {c: [3]}}}],
                [{a: {b: {c: [3]}}}, customMethod],
              ]);
        });
  });

  describe('The behavior of custom functions on arrays ', function() {
    let products;
    beforeEach(function() {
      products = [
        {price: 10},
        {price: 20},
        {price: 30},
      ];
    });
    it('maintains the length of an array', function() {
      let customMethod = function() {
        let products = this.get('products');
        this.set('numProducts', products.length);
      };
      assertProcessStates([{'products': products}, customMethod],
          {'products': products, numProducts: 3},
          [
            [{'products': products}, {'products': products}],
            [{'products': products, numProducts: 3}, customMethod],
          ]);
    });

    it('allows for array modification with push and pop', function() {
      let expectedProducts = [
        {price: 10},
        {price: 20},
        {price: 60},
      ];
      let customMethod = function() {
        let products = this.get('products');
        let lastProduct = products.pop();
        lastProduct.price = lastProduct.price * 2;
        products.push(lastProduct);
      }
      assertProcessStates(
          [{'products': products}, customMethod],
          {'products': expectedProducts},
          [
            [{'products': products}, {'products': products}],
            [{'products': expectedProducts}, customMethod]
          ]);
    });

    it('Allows elementwise array access in custom functions', function() {
      let customMethod = function(){
        let products = this.get('products');
        let total = 0;
        for (let i = 0; i < products.length; i++) {
          total += products[i].price;
        }
        this.set('orderTotal', total);
      };
      assertProcessStates(
          [{'products': products}, customMethod],
          {'products': products, orderTotal: 60},
          [
            [{'products': products}, {'products': products}],
            [{'products': products, orderTotal: 60}, customMethod],
          ]);
    });
  });

  describe('The behavior with custom methods that throw errors',
      function() {
    it('Does not crash when an error is thrown ', function() {
      let errorFunction = () => {throw 'Scary Error';};
      assertProcessStates([errorFunction], {}, [[{}, errorFunction]]);
    });

    it('executes setter code before an error is thrown',
        function() {
          let errorFunction = function() {
            this.set('a', 1);
            throw 'Scary Error';
          };
          assertProcessStates(
              [errorFunction],
              {a: 1},
              [[{a: 1}, errorFunction]]);
        });

    it('executes modifying code before an error is thrown',
        function() {
          let errorFunction = function() {
            this.set('a', 3);
            throw 'Scary Error';
          };
          assertProcessStates(
              [{a: 1, b: 2}, errorFunction],
              {a: 3, b: 2},
              [
                [{a: 1, b: 2}, {a: 1, b: 2}],
                [{a: 3, b: 2}, errorFunction],
              ]);
        });

    it('does not affect messages further down the queue when errors are thrown',
        function() {
        let errorFunction = function(){
            this.set('a', 1);
            throw 'Scary Error';
          };
          assertProcessStates(
              [errorFunction, {a: 2}],
              {a: 2},
              [
                [{a: 1}, errorFunction],
                [{a: 2}, {a: 2}],
              ]);
        });
  });
});
