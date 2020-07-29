goog.module('dataLayerHelper.helper.testing.processStates');
goog.setTestOnly();

const DataLayerHelper = goog.require('dataLayerHelper.helper.DataLayerHelper');

describe('The `processStates_` function of helper', () => {
  /**
   * Asserts that calling processStates_ with the given arguments will result
   * in the expected model state and expected calls to the listener.
   *
   * @param {!Array<!Object<*>>} states The states argument for the call to
   *     processStates_.
   * @param {!Object<*>} expectedModel The expected model
   *     state after the call.
   * @param {!Array<!Array<*>>} expectedListenerCalls The expected calls made
   *     to the helper's listener. Should be an array of arrays where each sub-
   *     array represents the arguments passed to the listener during a call.
   */
  function assertProcessStates(states, expectedModel, expectedListenerCalls) {
    const doAssert = (skipListener) => {
      const listenerCalls = [];
      // Spy on calls to the listener. We can't use a jasmine spy since
      // values are mutable and jasmine spies only do shallow copies of
      // the arguments. This function can't be an arrow function since it
      // uses arguments.
      const listener = function() {
        listenerCalls.push(
            // Push a deep copy of the arguments.
            jQuery.extend(true, [], [].slice.call(arguments, 0)));
      };
      const helper = new DataLayerHelper([], listener);
      DataLayerHelper.prototype.processStates_
          .call(helper, states, skipListener);

      expect(helper.model_).toEqual(expectedModel);
      expect(listenerCalls)
          .toEqual(skipListener ? [] : expectedListenerCalls);

      expect(helper.unprocessed_).toEqual([]);
      expect(helper.executingListener_).toBeFalse();
    };

    doAssert(true);
    doAssert(false);
  }

  describe('the behavior of process states', () => {
    it('does nothing with no states or model', () => {
      assertProcessStates(/* states= */[], /* expectedModel= */ {},
          /* expectedListenerCalls= */ []);
    });

    it('makes a call when a single state needs to be processed', () => {
      assertProcessStates([{a: 1}], {a: 1}, [[{a: 1}, {a: 1}]]);
    });

    it('makes two calls when two states need to be processed', () => {
      assertProcessStates([{a: 1}, {a: 2}], {a: 2},
          [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}]]);
    });

    it('makes calls with nested state arguments', () => {
      assertProcessStates([{'a.b': 1}], {a: {b: 1}},
          [[{a: {b: 1}}, {'a.b': 1}]]);
    });
  });

  describe('the behavior with custom setter methods', () => {
    it('makes an overridding setter call', () => {
      const customMethod = function() {
        this.set('a', 1);
      };
      assertProcessStates(
          [{a: 0}, customMethod],
          {a: 1},
          [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);
    });

    it('makes a setter call on empty state', () => {
      const customMethod = function() {
        this.set('b', 'one');
      };
      assertProcessStates(
          [customMethod],
          {b: 'one'},
          [[{b: 'one'}, customMethod]]);
    });

    it('makes a setter call on a complex nested object', () => {
      const customMethod = function() {
        this.set('c.d', [3]);
      };
      assertProcessStates(
          [customMethod],
          {c: {d: [3]}},
          [[{c: {d: [3]}}, customMethod]]);
    });

    it('maintains state when calling custom methods', () => {
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

    it('maintains nested state when calling custom methods', () => {
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
        () => {
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

  describe('The behavior of custom functions on arrays ', () => {
    let products;
    beforeEach(() => {
      products = [
        {price: 10},
        {price: 20},
        {price: 30},
      ];
    });

    it('maintains the length of an array', () => {
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

    it('allows for array modification with push and pop', () => {
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

    it('allows elementwise array access in custom functions', () => {
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

  describe('the behavior with custom methods that throw errors',
      () => {
        it('Does not crash when an error is thrown ', () => {
          const errorFunction = () => {
            throw Error('Scary Error');
          };
          assertProcessStates([errorFunction], {}, [[{}, errorFunction]]);
        });

        it('executes setter code before an error is thrown', () => {
          const errorFunction = function() {
            this.set('a', 1);
            throw Error('Scary Error');
          };
          assertProcessStates(
                  [errorFunction],
                  {a: 1},
                  [[{a: 1}, errorFunction]]);
        });

        it('executes modifying code before an error is thrown', () => {
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
            ' the queue when errors are thrown', () => {
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
