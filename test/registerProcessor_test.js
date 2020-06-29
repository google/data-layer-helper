goog.require('helper');

describe('The registerProcessor method', function() {
  let dataLayer;
  let dlh;
  let commandAPI;
  beforeEach(function() {
    dataLayer = [];
    commandAPI = function() {
      dataLayer.push(arguments);
    };
    dlh = new helper.DataLayerHelper(dataLayer);
  });

  describe('the function registration process', function() {
    it('allows registration of functions with arbitrary names', function() {
      let called = false;
      dlh.registerProcessor('!This funct%n @m@zing~0.0', () => {
        called = true;
      });
      commandAPI('!This funct%n @m@zing~0.0');

      expect(called).toBe(true);
    });

    it('allows registration of functions with names that are in use',
        function() {
          let called = false;
          dlh.registerProcessor('set', () => {
            called = true;
          });
          commandAPI('set', 'one', 1);

          expect(dlh.get('one')).toBe(1);
          expect(called).toBe(true);
        });
  });

  describe('Order of calling registered functions');
  {
    it('calls registered functions in the order they were registered',
        function() {
          dlh.registerProcessor('myMostFantasticFunction', () => {
            return {'key': 7};
          });
          dlh.registerProcessor('myMostFantasticFunction', () => {
            return {'key': 5};
          });
          commandAPI('myMostFantasticFunction', 'one', 1);

          expect(dlh.get('key')).toBe(5);
        });

    it('considers built in functions to be registered first',
        function() {
          dlh.registerProcessor('set', (model, key) => {
            return {key: 3};
          });
          commandAPI('set', 'two', 2);

          expect(dlh.get('two')).toBe(3);
        });

    it('does not update the model until all processors have run', function() {
      dataLayer.push({5: 10});
      dlh.registerProcessor('operate', (model) => {
        expect(model[5]).toBe(10);
        expect(dlh.get(5)).toBe(10);
        return {5: 20};
      });
      dlh.registerProcessor('operate', (model) => {
        expect(model[5]).toBe(10);
        expect(dlh.get(5)).toBe(10);
        return {5: 30};
      });
      commandAPI('operate');

      expect(dlh.get(5)).toBe(30);
    });
  }

  describe('behavior of a registered command', function() {
    it('sets the model according to the return value', function() {
      dataLayer.push({'a': {'b': 4, 'c': 'bad'}});
      dlh.registerProcessor('make good', () => {
        return {'a': {'c': 'good'}};
      });
      commandAPI('make good');

      expect(dlh.get('a')).toEqual({'b': 4, 'c': 'good'});
    });

    it('takes the abstract model as the first argument', function() {
      dataLayer.push({'a': {'b': 4, 'c': 'bad'}}, {'x': []});
      dlh.registerProcessor('peek', (model) => {
        expect(model).toEqual({'a': {'b': 4, 'c': 'bad'}, 'x': []});
      });
      commandAPI('peek');
    });

    it('takes any number of additional arguments passed to the command API',
        function() {
          dlh.registerProcessor('alphabet',
              (model, a, b, c, d, e, f, g, h) => {
                expect(a + b + c + d + e + f + g + h).toBe('abcdefgh');
              });
          commandAPI('alphabet', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        });

    it('can accept parameters of any type', function() {
      dlh.registerProcessor('method',
          (model, {array, date}, ...rest) => {
            expect(array[1] + date.year).toBe(rest[2]);
          });
      commandAPI('method', {array: [1, 6, 28], date: new Date(2000, 0)},
          1, 'rats', 2006);
    });
  });

  describe('updates to the model', function() {
    beforeEach(function() {
      dataLayer.push({'a': 1, 'b': {'a': [1]}});
    });

    it('can create a new field in the model', function() {
      dlh.registerProcessor('method',
          (model, eventName, params) => {
            return {
              'last_event': `${eventName} ${params['target']}`,
            };
          });
      commandAPI('method', 'click', {'target': 'button'});

      expect(dlh.get('last_event')).toBe('click button');
    });

    it('can overwrite nested fields of the model', function() {
      dlh.registerProcessor('event', () => {
        return {
          'b': {'a': [3]},
        };
      });
      commandAPI('event');

      expect(dlh.get('b.a')).toBe([3]);
    });

    it('can add new nested fields of the model', function() {
      dlh.registerProcessor('event', () => {
        return {
          'b': {'b': 2},
        };
      });
      commandAPI('method', 'click', {'target': 'button'});

      expect(dlh.get('b')).toBe({'a': [1], 'b': 2});
    });

    it('can update nested fields of the model', function() {
      dlh.registerProcessor('event', () => {
        const array = dlh.get('b.a');
        array.push(2);
        return {
          'b': {'a': array},
        };
      });
      commandAPI('method', 'click', {'target': 'button'});

      expect(dlh.get('b')).toBe({'a': [1, 2], 'b': 2});
    });
  });
});
