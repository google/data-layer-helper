describe('The data layer helper library', () => {
  it('does not pollute the global scope', () => {
    expect(window['dataLayer']).toBeUndefined();
    expect(window['goog']).toBeUndefined();
    expect(window['helper']).toBeUndefined();
    expect(window['plain']).toBeUndefined();
    expect(window['isPlainObject']).toBeUndefined();
    expect(window['expandKeyValue']).toBeUndefined();
    expect(window['LogLevel']).toBeUndefined();
  });

  describe('the DataLayerHelper API', () => {
    let helper;
    beforeEach(() => {
      helper = new DataLayerHelper([]);
    });

    it('exposes DataLayerHelper constructor', () => {
      expect(typeof DataLayerHelper).toBe('function');
    });

    it('has four methods: get, flatten, process and registerProcessor', () => {
      expect(typeof helper.get).toBe('function');
      expect(typeof helper.flatten).toBe('function');
      expect(typeof helper.process).toBe('function');
      expect(typeof helper.registerProcessor).toBe('function');
    });

    it('does not expose any private helper functions', () => {
      expect(helper.processStates_).toBeUndefined();
      expect(helper.processCommand_).toBeUndefined();
      expect(helper.expandKeyValue).toBeUndefined();
      expect(helper.isArray).toBeUndefined();
      expect(helper.merge).toBeUndefined();
    });
  });

  describe('the DataLayerHelper constructor', () => {
    let helper;
    let dataLayer;
    let callbackListener;

    /**
     * Asserts that the construction of the helper was performed
     * correctly based on if listener and listenToPast arguments
     * are working correctly.
     * @param {number} callsAfterConstruction
     * @param {number} callsAfterPush
     */
    function checkConstructor(callsAfterConstruction, callsAfterPush) {
      expect(callbackListener.calls.count()).toBe(callsAfterConstruction);
      dataLayer.push({one: 1});

      expect(callbackListener.calls.count()).toBe(callsAfterPush);
    }

    beforeEach(() => {
      callbackListener = jasmine.createSpy();
    });

    it('supports the legacy listener argument', () => {
      dataLayer = [];
      helper = new DataLayerHelper(dataLayer,
          /* listener= */ callbackListener);

      checkConstructor(0, 1);
    });

    it('supports the legacy listener and listenToPast arguments', () => {
      dataLayer = [{one: 1}];
      helper = new DataLayerHelper(dataLayer,
          /* listener= */ callbackListener,
          /* listenToPast= */ true);

      checkConstructor(1, 2);
    });

    it('does not listenToPast by default using legacy arguments', () => {
      dataLayer = [{one: 1}];
      helper = new DataLayerHelper(dataLayer,
        /* listener= */ callbackListener);

      checkConstructor(0, 1);
    });

    it('supports the options object', () => {
      dataLayer = [];
      helper = new DataLayerHelper(dataLayer, {listener: callbackListener});

      checkConstructor(0, 1);
    });

    it('supports listenToPast in options object', () => {
      dataLayer = [{one: 1}];
      helper = new DataLayerHelper(dataLayer,
          {listener: callbackListener, listenToPast: true});

      checkConstructor(1, 2);
    });

    it('does not listenToPast by default using options object', () => {
      dataLayer = [{one: 1}];
      helper = new DataLayerHelper(dataLayer, {listener: callbackListener});

      checkConstructor(0, 1);
    });

    it('supports registering commandProcessors in options object', () => {
      dataLayer = [{totalSum: 2}];
      const commandAPI = function() {
        dataLayer.push(arguments);
      };
      helper = new DataLayerHelper(dataLayer, {
        commandProcessors: {
          'add': [function(a, b) {
            return {sum: a + b};
          },
          function(a, b) {
            return {sum: this.get('totalSum') + a + b};
          }],
        }});

      commandAPI('add', 1, 2);

      expect(helper.get('sum')).toBe(5);
      expect(helper.get('totalSum')).toBe(2);
    });

    it('supports processNow in options object', () => {
      dataLayer = [{one: 1}];
      helper = new DataLayerHelper(dataLayer,
          {listener: callbackListener, listenToPast: true,
            processNow: false});

      checkConstructor(0, 0);

      expect(helper.get('one')).toBe(undefined);

      helper.process();

      expect(callbackListener.calls.count()).toBe(2);
      expect(helper.get('one')).toBe(1);
    });
  });

  describe('the functionality of the helper', () => {
    let callbackListener;
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
      expect(callbackListener.calls.count()).toBe(numberOfCalls);
      expect(callbackListener.calls.mostRecent().args).toEqual(expected);
    }

    beforeEach(() => {
      dataLayer = [];
      callbackListener = jasmine.createSpy();
      helper = new DataLayerHelper(dataLayer, callbackListener);
    });

    describe('the result of calling built in methods', () => {
      it(`returns undefined for data that hasn't been pushed`, () => {
        expect(callbackListener).not.toHaveBeenCalled();
        expect(helper.get('one')).toBeUndefined();
        expect(helper.get('two')).toBeUndefined();
      });

      it('can set two objects in the abstract state in one data layer push',
          () => {
            dataLayer.push({one: 1, two: 2});

            assertCallback(/* expected= */ [{one: 1, two: 2}, {one: 1, two: 2}],
                /* numberOfCalls= */ 1);

            expect(helper.get('one')).toBe(1);
            expect(helper.get('two')).toBe(2);
          });

      it('can override an object in the abstract state after data layer push',
          () => {
            dataLayer.push({one: 1, two: 2}, {two: 3});

            assertCallback(/* expected= */ [{one: 1, two: 3}, {two: 3}],
                /* numberOfCalls= */ 2);

            expect(helper.get('one')).toBe(1);
            expect(helper.get('two')).toBe(3);
          });

      it('can overwrite data twice in a row', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});

        assertCallback(/* expected= */ [{one: 1, two: 2}, {two: 2}],
            /* numberOfCalls= */ 3);

        expect(helper.get('one')).toBe(1);
        expect(helper.get('two')).toBe(2);
      });

      it('can write to deeply nested objects', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}});

        assertCallback(/* expected= */ [
              {one: {three: 3}, two: 2},
              {one: {three: 3}},
            ],
            /* numberOfCalls= */ 4);

        expect(helper.get('one')).toEqual({three: 3});
        expect(helper.get('two')).toBe(2);
      });

      it('can append to deeply nested objects', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        assertCallback(/* expected= */ [
          {one: {three: 3, four: 4}, two: 2},
          {one: {four: 4}},
        ], /* numberOfCalls= */ 5);

        expect(helper.get('one')).toEqual({three: 3, four: 4});
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('two')).toBe(2);
      });

      it('can flatten the history to a single object', () => {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});

        expect(dataLayer.length).toBe(5);
        expectDataLayerEquals(/* expected= */ [
              {one: 1, two: 2}, {two: 3},
              {two: 2}, {one: {three: 3}}, {one: {four: 4}}],
            dataLayer);

        helper.flatten();

        expect(dataLayer.length).toBe(1);
        expectDataLayerEquals(
            /* expected= */ [{one: {three: 3, four: 4}, two: 2}], dataLayer);

        expect(helper.get('one')).toEqual({three: 3, four: 4});
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('two')).toBe(2);
      });

      it('works normally after flatten', function() {
        dataLayer.push({one: 1, two: 2}, {two: 3}, {two: 2});
        dataLayer.push({one: {three: 3}}, {one: {four: 4}});
        helper.flatten();
        dataLayer.push({five: 5});

        assertCallback(/* expected= */ [
          {one: {three: 3, four: 4}, two: 2, five: 5},
          {five: 5},
        ], /* numberOfCalls= */ 6);

        expect(dataLayer.length).toBe(2);
        expect(helper.get('one.four')).toBe(4);
        expect(helper.get('five')).toBe(5);
      });
    });

    describe('the result of calling custom methods', () => {
      it('calls custom methods pushed to the dataLayer that ' +
          'may change state', () => {
        dataLayer.push(
            {a: 'originalValue'},
            () => {
              dataLayer.push({a: 'newValue'});
            });

        expect(helper.get('a')).toBe('newValue');
      });

      it('allows for recursive type methods that ' +
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

    describe('the registerProcessor command', () => {
      it('Runs commands that use registerProcessor', () => {
        /** Set up the command API. */
        function commandAPI() {
          dataLayer.push(arguments);
        }
        helper = new DataLayerHelper(dataLayer);
        helper.registerProcessor('add', function(numberToAdd) {
          const a = this.get('a');
          return {sum: numberToAdd + a};
        });
        dataLayer.push({a: 1});
        commandAPI('add', 2);

        expect(helper.get('a')).toBe(1);
        expect(helper.get('sum')).toBe(3);
      });
    });
  });
});
