goog.module('datalayerhelper.helper.testing.processStates_');
goog.setTestOnly();

const helper = goog.require('helper');

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
    const MockHelper = function() {
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

    const doAssert = (skipListener) => {
      MockHelper.prototype = new DataLayerHelper([]);
      const helper = new MockHelper();
      DataLayerHelper.prototype.processStates_.call(helper, states,
          skipListener);

      expect(helper.model_).toEqual(expectedModel);
      expect(helper.listenerCalls_)
          .toEqual(skipListener ? [] : expectedListenerCalls);

      expect(helper.unprocessed_).toEqual([]);
      expect(helper.executingListener_).toBe(false);
    };

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

    it('makes two calls when two states need to be processed', function() {
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
      const customMethod = function() {
        this.set('a', 1);
      };
      assertProcessStates(
          [{a: 0}, customMethod],
          {a: 1},
          [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);
    });

    it('makes a setter call on empty state', function() {
      const customMethod = function() {
        this.set('b', 'one');
      };
      assertProcessStates(
          [customMethod],
          {b: 'one'},
          [[{b: 'one'}, customMethod]]);
    });

    it('makes a setter call on a complex nested object', function() {
      const customMethod = function() {
        this.set('c.d', [3]);
      };
      assertProcessStates(
          [customMethod],
          {c: {d: [3]}},
          [[{c: {d: [3]}}, customMethod]]);
    });

    it('maintains state when calling custom methods', function() {
      const customMethod = function() {
        const a = this.get('a');

        expect(a).toBe(1);
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
      const customMethod = function() {
        const b = this.get('a.b');

        expect(b).toBe(2);
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
          const customMethod = function() {
            const a = this.get('a');

            expect(a.b.c[0]).toBe(3);
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
      const customMethod = function() {
        const products = this.get('products');
        this.set('numProducts', products.length);
      };
      assertProcessStates([{'products': products}, customMethod],
          {'products': products, 'numProducts': 3},
        [
            [{'products': products}, {'products': products}],
            [{'products': products, 'numProducts': 3}, customMethod],
        ]);
    });

    it('allows for array modification with push and pop', function() {
      const expectedProducts = [
        {price: 10},
        {price: 20},
        {price: 60},
      ];
      const customMethod = function() {
        const products = this.get('products');
        const lastProduct = products.pop();
        lastProduct.price = lastProduct.price * 2;
        products.push(lastProduct);
      };
      assertProcessStates(
          [{'products': products}, customMethod],
          {'products': expectedProducts},
        [
            [{'products': products}, {'products': products}],
            [{'products': expectedProducts}, customMethod],
        ]);
    });

    it('Allows elementwise array access in custom functions', function() {
      const customMethod = function() {
        const products = this.get('products');
        let total = 0;
        for (let i = 0; i < products.length; i++) {
          total += products[i].price;
        }
        this.set('orderTotal', total);
      };
      assertProcessStates(
          [{'products': products}, customMethod],
          {'products': products, 'orderTotal': 60},
        [
            [{'products': products}, {'products': products}],
            [{'products': products, 'orderTotal': 60}, customMethod],
        ]);
    });
  });

  describe('The behavior with custom methods that throw errors',
      function() {
        it('Does not crash when an error is thrown ', function() {
          const errorFunction = () => {
            throw Error('Scary Error');
          };
          assertProcessStates([errorFunction], {}, [[{}, errorFunction]]);
        });

        it('executes setter code before an error is thrown',
            function() {
              const errorFunction = function() {
                this.set('a', 1);
                throw Error('Scary Error');
              };
              assertProcessStates(
                  [errorFunction],
                  {a: 1},
                  [[{a: 1}, errorFunction]]);
            });

        it('executes modifying code before an error is thrown',
            function() {
              const errorFunction = function() {
                this.set('a', 3);
                throw Error('Scary Error');
              };
              assertProcessStates(
                  [{a: 1, b: 2}, errorFunction],
                  {a: 3, b: 2},
                [
                    [{a: 1, b: 2}, {a: 1, b: 2}],
                    [{a: 3, b: 2}, errorFunction],
                ]);
            });

        it('does not affect messages further down' +
            ' the queue when errors are thrown', function() {
          const errorFunction = function() {
            this.set('a', 1);
            throw Error('Scary Error');
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
