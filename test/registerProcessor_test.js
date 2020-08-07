goog.module('dataLayerHelper.helper.testing.registerProcessor');
goog.setTestOnly();

const DataLayerHelper = goog.require('dataLayerHelper.helper.DataLayerHelper');

describe('The registerProcessor method of helper', () => {
  let dataLayer;
  let dataLayerHelper;
  let commandAPI;
  let spy;
  beforeEach(() => {
    dataLayer = [];
    commandAPI = function() {
      dataLayer.push(arguments);
    };
    dataLayerHelper = new DataLayerHelper(dataLayer);
    spy = jasmine.createSpy('spy');
  });

  describe('the examples in the README', () => {
    it('is consistent with the register processors subsection of the ' +
        'README', () => {
      dataLayerHelper.registerProcessor('add', function(number1, number2) {
        // The return value will be merged into the model.
        return {sum: number1 + number2};
      });

      dataLayerHelper.registerProcessor('copy', function() {
        const sum = this.get('sum');
        return {ans: sum};
      });

      dataLayerHelper.registerProcessor('copy', function() {
        const ans = this.get('ans');
        return {finalAns: ans};
      });

      expect(dataLayerHelper.get('sum')).toBeUndefined();
      expect(dataLayerHelper.get('ans')).toBeUndefined();
      expect(dataLayerHelper.get('finalAns')).toBeUndefined();
      commandAPI('add', 1, 2);

      expect(dataLayerHelper.get('sum')).toBe(3);
      expect(dataLayerHelper.get('ans')).toBeUndefined();
      expect(dataLayerHelper.get('finalAns')).toBeUndefined();
      commandAPI('copy');

      expect(dataLayerHelper.get('sum')).toBe(3);
      expect(dataLayerHelper.get('ans')).toBe(3);
      expect(dataLayerHelper.get('finalAns')).toBeUndefined();
      commandAPI('copy');

      expect(dataLayerHelper.get('sum')).toBe(3);
      expect(dataLayerHelper.get('ans')).toBe(3);
      expect(dataLayerHelper.get('finalAns')).toBe(3);
    });

    it('is consistent with the documentation in data-layer-helper.js', () => {
      dataLayerHelper.registerProcessor('add', function(numberToAdd) {
        const a = this.get('a');
        return {sum: numberToAdd + a};
      });
      dataLayer.push({a: 1});
      commandAPI('add', 2);

      expect(dataLayerHelper.get('a')).toBe(1);
      expect(dataLayerHelper.get('sum')).toBe(3);
    });
  });

  describe('the function registration process', () => {
    it('allows registration of functions with arbitrary names', () => {
      dataLayerHelper.registerProcessor('!This funct%n @m@zing~0.0', spy);
      commandAPI('!This funct%n @m@zing~0.0');

      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('order of calling registered functions', () => {
    it('calls registered functions only when the commandAPI ' +
        'fires the appropriate event', () => {
      dataLayerHelper.registerProcessor('process', () => {
        spy('a');
        dataLayerHelper.registerProcessor('process', () => {
          spy('b');
        });
      });
      commandAPI('process');

      expect(spy.calls.allArgs()).toEqual([['a']]);
    });

    it('calls registered functions when the commandAPI ' +
        'fires the appropriate event, no matter where it was called', () => {
      dataLayerHelper.registerProcessor('process', () => {
        spy('a');
        dataLayerHelper.registerProcessor('process2', () => {
          spy('b');
        });
        commandAPI('process2');
      });
      commandAPI('process');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b']]);
    });

    it('calls registered functions in the order they were registered',
        () => {
          dataLayerHelper.registerProcessor('myFunction', () => spy('a'));
          dataLayerHelper.registerProcessor('myFunction', () => spy('b'));
          dataLayerHelper.registerProcessor('myFunction', () => spy('c'));
          commandAPI('myFunction');

          expect(spy.calls.allArgs()).toEqual([['a'], ['b'], ['c']]);
        });


    it('is called before the default listener', () => {
      dataLayerHelper = new DataLayerHelper(dataLayer, () => spy('a'));
      dataLayerHelper.registerProcessor('method', () => spy('b'));
      commandAPI('method');

      expect(spy.calls.allArgs()).toEqual([['b'], ['a']]);
    });

    it('can be invoked by the default listener', () => {
      const f1 = () => {
        spy('a');
        if (spy.calls.count() === 1) {
          commandAPI('method');
        }
      };
      const f2 = () => {
        spy('b');
      };
      dataLayerHelper = new DataLayerHelper(dataLayer, f1);
      dataLayerHelper.registerProcessor('method', f2);
      commandAPI('Crazy command');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b'], ['a']]);
    });

    it('does not update the model until all processors have run', () => {
      dataLayer.push({'5': 10});
      dataLayerHelper.registerProcessor('operate', function() {
        expect(this.get('5')).toBe(10);
        expect(dataLayerHelper.get('5')).toBe(10);
        return {5: 20};
      });
      dataLayerHelper.registerProcessor('operate', function() {
        expect(this.get('5')).toBe(10);
        expect(dataLayerHelper.get('5')).toBe(10);
        return {5: 30};
      });
      commandAPI('operate');

      expect(dataLayerHelper.get('5')).toBe(30);
    });
  });

  describe('the parameters of a registered command', () => {
    it('can access the model through the this keyword', () => {
      dataLayer.push({'a': {'b': 4, 'c': 'bad'}}, {'x': []});
      dataLayerHelper.registerProcessor('peek', function() {
        expect(this.get('a')).toEqual({'b': 4, 'c': 'bad'});
        expect(this.get('x')).toEqual([]);
      });
      commandAPI('peek');
    });

    it('takes any number of additional arguments passed to the command API',
        () => {
          dataLayerHelper.registerProcessor('alphabet',
              (a, b, c, d, e, f, g, h) => {
                expect(a + b + c + d + e + f + g + h).toBe('abcdefgh');
              });
          commandAPI('alphabet', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        });

    it('can accept parameters of any type', () => {
      dataLayerHelper.registerProcessor('method', ({array, date}, ...rest) => {
        expect(array).toEqual([1, 6, 28]);
        expect(date).toEqual(new Date(2000, 0));
        expect(rest).toEqual([1, 'rats', 2006]);
      });
      commandAPI('method', {array: [1, 6, 28], date: new Date(2000, 0)},
          1, 'rats', 2006);
    });
  });

  describe(`the registered command's interface with the model`,
      () => {
        beforeEach(() => {
          dataLayer.push({'a': 1, 'b': {'a': [1]}});
        });

        it('can create a new field in the model', () => {
          dataLayerHelper.registerProcessor('method', (eventName, params) => {
            return {
              'last_event': `${eventName} ${params['target']}`,
            };
          });
          commandAPI('method', 'click', {'target': 'button'});

          expect(dataLayerHelper.get('last_event')).toBe('click button');
        });

        it('can overwrite nested fields of the model', () => {
          dataLayerHelper.registerProcessor('event', () => {
            return {
              'b': {'a': [3]},
            };
          });
          commandAPI('event');

          expect(dataLayerHelper.get('b.a')).toEqual([3]);
        });

        it('can add new nested fields of the model', () => {
          dataLayerHelper.registerProcessor('event', () => {
            return {
              'b': {'b': 2},
            };
          });
          commandAPI('event');

          expect(dataLayerHelper.get('b')).toEqual({'a': [1], 'b': 2});
        });

        it('can update nested fields of the model', () => {
          dataLayerHelper.registerProcessor('event', function() {
            const array = this.get('b.a');
            array.push(2);
            return {
              'b': {'a': array},
            };
          });
          commandAPI('event');

          expect(dataLayerHelper.get('b')).toEqual({'a': [1, 2]});
        });

        it('sets the model according to the return value', () => {
          dataLayer.push({'a': {'b': 4, 'c': 'bad'}});
          dataLayerHelper.registerProcessor('make good', () => {
            return {'a': {'c': 'good'}};
          });
          commandAPI('make good');

          expect(dataLayerHelper.get('a')).toEqual({'b': 4, 'c': 'good'});
        });

        it('can access the abstract model interface through this', () => {
          dataLayerHelper.registerProcessor('event', function() {
            const init = this.get('b.a');
            this.set('b.a', 'new');
            const end = this.get('b.a');

            expect(init).toEqual([1]);
            expect(end).toEqual('new');
          });
          commandAPI('event');

          expect(dataLayerHelper.get('b')).toEqual({'a': 'new'});
        });
      });

  describe(`the registered command's connection to a command API`, () => {
    it('can call the command API', () => {
      dataLayerHelper.registerProcessor('method', () => {
        spy('a');
        commandAPI('method2');
      });
      dataLayerHelper.registerProcessor('method2', () => {
        spy('b');
      });
      commandAPI('method');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b']]);
    });

    it('can call itself with command API', () => {
      dataLayerHelper.registerProcessor('method', () => {
        if (spy.calls.count() < 5) {
          spy('a');
          commandAPI('method');
        }
      });
      commandAPI('method');

      expect(spy.calls.allArgs()).toEqual([['a'], ['a'], ['a'], ['a'], ['a']]);
    });
  });
});
