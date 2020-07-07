describe('The data layer helper library', function() {
  it('does not pollute the global scope', function() {
    expect(window['dataLayer']).toBe(undefined);
    expect(window['goog']).toBe(undefined);
    expect(window['helper']).toBe(undefined);
    expect(window['plain']).toBe(undefined);
    expect(window['isPlainObject']).toBe(undefined);
    expect(window['explandKeyValue_']).toBe(undefined);
  });

  describe('The DataLayerHelper API', () => {
    let helper;
    beforeEach(function() {
      helper = new DataLayerHelper([]);
    });

    it('exposes DataLayerHelper constructor', () => {
      expect(typeof DataLayerHelper).toBe('function');
    });

    it('has two functions, get and flatten', () => {
      expect(typeof helper.get).toBe('function');
      expect(typeof helper.flatten).toBe('function');
    });

    it('does not expose any private helper functions', () => {
      expect(helper.processStates_).toBe(undefined);
      expect(helper.expandKeyValue_).toBe(undefined);
      expect(helper.isArray_).toBe(undefined);
      expect(helper.merge_).toBe(undefined);
    });
  });

  describe('The functionality of the helper', () => {
    let callbacks;
    let dataLayer;
    let helper;

    /**
     * Assert that the last callback is what we expect and the number of
     * callbacks is correct.
     * @param {!Object} expected The callback we expect to see
     * @param {number} numberOfCalls The number of calls we expect to have seen
     * so far.
     */
    function assertCallback(expected, numberOfCalls) {
      expect(callbacks.length).toBe(numberOfCalls);
      expect(callbacks[callbacks.length - 1]).toEqual(expected);
    }

    /**
     * Checks that each of the values of two array-like objects are deep equal.
     * This is needed because jasmine's toEqual compares the functional
     * attributes of dataLayer, which includes a push function.
     * Since the push function is an anonymous function that gets
     * recreated every time, we can't create an object that
     * is deep equal to any dataLayer.
     * @param {!Array<Object>} arr1 The first array-like object
     * @param {!Array<Object>} arr2 The second array-like object
     */
    function expectEqualContents(arr1, arr2) {
      expect(arr1.length).toBe(arr2.length);
      for (let i = 0; i < arr1.length; i++) {
        expect(arr1[i]).toEqual(arr2[i]);
      }
    }

    /**
     * Automatically update the callbacks array with a description
     * of calls made to the data layer.
     */
    function callbackListener() {
      callbacks.push([].slice.call(arguments, 0));
    }

    beforeEach(() => {
      callbacks = [];
      dataLayer = [];
      helper = new DataLayerHelper(dataLayer, callbackListener);
    });

    describe('The result of calling built in methods', () => {
      it(`returns undefined for data that hasn't been pushed`, () => {
        expect(callbacks.length).toBe(0);
        expect(helper.get('one')).toBe(undefined);
        expect(helper.get('two')).toBe(undefined);
      });

      it('can set two objects in the abstract state in one data layer push',
          () => {
            dataLayer.push({one: 1, two: 2});

            assertCallback([{one: 1, two: 2}, {one: 1, two: 2}], 1);

            expect(helper.get('one')).toBe(1);
            expect(helper.get('two')).toBe(2);
          });

      it('can override an object in the abstract state after data layer push',
          () => {
            dataLayer.push({one: 1, two: 2}, {two: 3});

            assertCallback([{one: 1, two: 3}, {two: 3}], 2);

            expect(helper.get('one')).toBe(1);
            expect(helper.get('two')).toBe(3);
          });

      it('can overwrite data twice in a row', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});

        assertCallback([{one: 1, two: 2}, {two: 2}], 3);

        expect(helper.get('one')).toBe(1);
        expect(helper.get('two')).toBe(2);
      });

      it('can write to deeply nested objects', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}});

        assertCallback([{one: {three: 3}, two: 2}, {one: {three: 3}}], 4);

        expect(helper.get('one')).toEqual({three: 3});
        expect(helper.get('two')).toBe(2);
      });

      it('can append to deeply nested objects', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        assertCallback([
          {one: {three: 3, four: 4}, two: 2},
          {one: {four: 4}}], 5);

        expect(helper.get('one')).toEqual({three: 3, four: 4});
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('two')).toBe(2);
      });

      it('can flatten the history to a single object', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        expect(dataLayer.length).toBe(5);
        expectEqualContents(dataLayer, [
          {one: 1, two: 2}, {two: 3},
          {two: 2}, {one: {three: 3}}, {one: {four: 4}}]);

        helper.flatten();

        expect(dataLayer.length).toBe(1);
        expectEqualContents(dataLayer,
            [{one: {three: 3, four: 4}, two: 2}]);

        expect(helper.get('one')).toEqual({three: 3, four: 4});
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('two')).toBe(2);
      });

      it('works normally after flatten', function() {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});
        helper.flatten();
        dataLayer.push({five: 5});

        assertCallback([
          {one: {three: 3, four: 4}, two: 2, five: 5}, {five: 5}], 6);

        expect(dataLayer.length).toBe(2);
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('five')).toBe(5);
      });
    });

    describe('The result of calling custom methods', () => {
      it('calls custom methods pushed to the dataLayer that ' +
        'may change state', () => {
        dataLayer.push(
            {a: 'originalValue'},
            () => {
              dataLayer.push({a: 'newValue'});
            });

        expect(helper.get('a')).toBe('newValue');
      });

      it('Allows for recursive type methods that ' +
        'push themselves to the dataLayer', () => {
        dataLayer.push(
            {numCustomMethodCalls: 0},
            function() {
              const method = function() {
                const numCalls = this.get('numCustomMethodCalls');
                if (numCalls < 10) {
                  this.set('numCustomMethodCalls', numCalls + 1);
                  dataLayer.push(method);
                }
              };
              dataLayer.push(method);
            });

        expect(helper.get('numCustomMethodCalls')).toBe(10);
      });
    });
  });
});
