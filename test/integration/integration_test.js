describe('The data layer helper library', function() {
  it('does not pollute the global scope', function() {
    expect(window['dataLayer']).toBe(undefined);
    expect(window['goog']).toBe(undefined);
    expect(window['helper']).toBe(undefined);
    expect(window['plain']).toBe(undefined);
    expect(window['isPlainObject']).toBe(undefined);
    expect(window['explandKeyValue_']).toBe(undefined);
  });

  describe('The DataLayerHelper API', function() {
    beforeEach(function() {
      this.helper = new DataLayerHelper([]);
    });

    it('exposes DataLayerHelper constructor', function() {
      expect(typeof DataLayerHelper).toBe('function');
    });

    it('has two functions, get and flatten', function() {
      expect(typeof this.helper.get).toBe('function');
      expect(typeof this.helper.flatten).toBe('function');
    });

    it('does not expose any private helper functions', function() {
      expect(this.helper.processStates_).toBe(undefined);
      expect(this.helper.expandKeyValue_).toBe(undefined);
      expect(this.helper.isArray_).toBe(undefined);
      expect(this.helper.merge_).toBe(undefined);
    });
  });

  describe('The functionality of the helper', function() {
    let callbacks;

    function assertCallback(expected, numberOfCalls) {
      expect(callbacks.length).toBe(numberOfCalls);
      expect(callbacks[callbacks.length - 1]).toEqual(expected);
    }

    /*
     * Checks that each of the values of two array-like objects are deep equal.
     * This is needed because jasmine's toEqual compares the functional
     * attributes of dataLayer, which includes a push function.
     * Since the push function is an anonymous function that gets
     * recreated every time, we can't create an object that
     * is deep equal to any dataLayer.
     * @params {!Array<Object>} arr1 The first array-like object
     * @params {!Array<Object>} arr2 The second array-like object
     */
    function expectEqualContents(arr1, arr2) {
      expect(arr1.length).toBe(arr2.length);
      for (let i = 0; i < arr1.length; i++) {
        expect(arr1[i]).toEqual(arr2[i]);
      }
    }

    function callbackListener() {
      callbacks.push([].slice.call(arguments, 0));
    }

    beforeEach(function() {
      callbacks = [];
      this.dataLayer = [];
      this.helper = new DataLayerHelper(this.dataLayer, callbackListener);
    });

    describe('The result of calling built in methods', function() {
      it(`returns undefined for data that hasn't been pushed`, function() {
        expect(callbacks.length).toBe(0);
        expect(this.helper.get('one')).toBe(undefined);
        expect(this.helper.get('two')).toBe(undefined);
      });

      it('can set two objects in the abstract state in one data layer push',
        function() {
          this.dataLayer.push({one: 1, two: 2});

          assertCallback([{one: 1, two: 2}, {one: 1, two: 2}], 1);
          expect(this.helper.get('one')).toBe(1);
          expect(this.helper.get('two')).toBe(2);
        });

      it('can override an object in the abstract state after data layer push',
        function() {
          this.dataLayer.push({one: 1, two: 2}, {two: 3});

          assertCallback([{one: 1, two: 3}, {two: 3}], 2);
          expect(this.helper.get('one')).toBe(1);
          expect(this.helper.get('two')).toBe(3);
        });

      it('can overwrite data twice in a row', function() {
        this.dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});

        assertCallback([{one: 1, two: 2}, {two: 2}], 3);
        expect(this.helper.get('one')).toBe(1);
        expect(this.helper.get('two')).toBe(2);
      });

      it('can write to deeply nested objects', function() {
        this.dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        this.dataLayer.push({one: {three: 3}});

        assertCallback([{one: {three: 3}, two: 2}, {one: {three: 3}}], 4);
        expect(this.helper.get('one')).toEqual({three: 3});
        expect(this.helper.get('two')).toBe(2);
      });

      it('can append to deeply nested objects', function() {
        this.dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        this.dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        assertCallback([
          {one: {three: 3, four: 4}, two: 2},
          {one: {four: 4}}], 5);
        expect(this.helper.get('one')).toEqual({three: 3, four: 4});
        expect(this.helper.get('one.four')).toBe(4);
        expect(this.helper.get('two')).toBe(2);
      });

      it('can flatten the history to a single object', function() {
        this.dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        this.dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        expect(this.dataLayer.length).toBe(5);
        expectEqualContents(this.dataLayer, [
          {one: 1, two: 2}, {two: 3},
          {two: 2}, {one: {three: 3}}, {one: {four: 4}}]);

        this.helper.flatten();

        expect(this.dataLayer.length).toBe(1);
        expectEqualContents(this.dataLayer,
          [{one: {three: 3, four: 4}, two: 2}]);
        expect(this.helper.get('one')).toEqual({three: 3, four: 4});
        expect(this.helper.get('one.four')).toBe(4);
        expect(this.helper.get('two')).toBe(2);
      });

      it('works normally after flatten', function() {
        this.dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        this.dataLayer.push({one: {three: 3}}, {one: {four: 4}});
        this.helper.flatten();
        this.dataLayer.push({five: 5});

        assertCallback([
          {one: {three: 3, four: 4}, two: 2, five: 5}, {five: 5}], 6);
        expect(this.dataLayer.length).toBe(2);
        expect(this.helper.get('one.four')).toBe(4);
        expect(this.helper.get('five')).toBe(5);
      });
    });

    describe('The result of calling custom methods', function() {
      it('calls custom methods pushed to the dataLayer that ' +
        'may change state', function() {
        this.dataLayer.push(
          {a: 'originalValue'},
          () => {
            this.dataLayer.push({a: 'newValue'});
          });

        expect(this.helper.get('a')).toBe('newValue');
      });

      it('Allows for recursive type methods that ' +
        'push themselves to the dataLayer', function() {
        let dataLayer = this.dataLayer;
        dataLayer.push(
          {numCustomMethodCalls: 0},
          function() {
            let method = function() {
              let numCalls = this.get('numCustomMethodCalls');
              if (numCalls < 10) {
                this.set('numCustomMethodCalls', numCalls + 1);
                dataLayer.push(method);
              }
            };
            dataLayer.push(method);
          });
        expect(this.helper.get('numCustomMethodCalls')).toBe(10);
      });
    });
  });
});
