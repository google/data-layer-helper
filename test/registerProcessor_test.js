goog.module('datalayerhelper.helper.testing.registerProcessor');
goog.setTestOnly();

const {DataLayerHelper} = goog.require('helper');

describe('The registerProcessor method of helper', () => {
  let dataLayer;
  let dlh;
  let commandAPI;
  let spy;
  beforeEach(() => {
    dataLayer = [];
    commandAPI = function() {
      dataLayer.push(arguments);
    };
    dlh = new DataLayerHelper(dataLayer);
    spy = jasmine.createSpy('spy');
  });

  describe('the function registration process', () => {
    it('allows registration of functions with arbitrary names', () => {
      dlh.registerProcessor('!This funct%n @m@zing~0.0', spy);
      commandAPI('!This funct%n @m@zing~0.0');

      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('order of calling registered functions', () => {
    it('calls registered functions only when the commandAPI ' +
        'fires the appropriate event', () => {
      dlh.registerProcessor('process', () => {
        spy('a');
        dlh.registerProcessor('process', () => {
          spy('b');
        });
      });
      commandAPI('process');

      expect(spy.calls.allArgs()).toEqual([['a']]);
    });

    it('calls registered functions when the commandAPI ' +
        'fires the appropriate event, no matter where it was called', () => {
      dlh.registerProcessor('process', () => {
        spy('a');
        dlh.registerProcessor('process2', () => {
          spy('b');
        });
        commandAPI('process2');
      });
      commandAPI('process');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b']]);
    });

    it('calls registered functions in the order they were registered',
        () => {
          dlh.registerProcessor('myMostFantasticFunction', () => spy('a'));
          dlh.registerProcessor('myMostFantasticFunction', () => spy('b'));
          dlh.registerProcessor('myMostFantasticFunction', () => spy('c'));
          commandAPI('myMostFantasticFunction');

          expect(spy.calls.allArgs()).toEqual([['a'], ['b'], ['c']]);
        });


    it('is called before the default listener', () => {
      dlh = new DataLayerHelper(dataLayer, () => spy('a'));
      dlh.registerProcessor('method', () => spy('b'));
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
      dlh = new DataLayerHelper(dataLayer, f1);
      dlh.registerProcessor('method', f2);
      commandAPI('Crazy command');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b'], ['a']]);
    });

    it('does not update the model until all processors have run', () => {
      dataLayer.push({'5': 10});
      dlh.registerProcessor('operate', function() {
        expect(this.get('5')).toBe(10);
        expect(dlh.get('5')).toBe(10);
        return {5: 20};
      });
      dlh.registerProcessor('operate', function() {
        expect(this.get('5')).toBe(10);
        expect(dlh.get('5')).toBe(10);
        return {5: 30};
      });
      commandAPI('operate');

      expect(dlh.get('5')).toBe(30);
    });
  });

  describe('the parameters of a registered command', () => {
    it('can access the model through the this keyword', () => {
      dataLayer.push({'a': {'b': 4, 'c': 'bad'}}, {'x': []});
      dlh.registerProcessor('peek', function() {
        expect(this.get('a')).toEqual({'b': 4, 'c': 'bad'});
        expect(this.get('x')).toEqual([]);
      });
      commandAPI('peek');
    });

    it('takes any number of additional arguments passed to the command API',
        () => {
          dlh.registerProcessor('alphabet',
              (a, b, c, d, e, f, g, h) => {
                expect(a + b + c + d + e + f + g + h).toBe('abcdefgh');
              });
          commandAPI('alphabet', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        });

    it('can accept parameters of any type', () => {
      dlh.registerProcessor('method', ({array, date}, ...rest) => {
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
          dlh.registerProcessor('method', (eventName, params) => {
            return {
              'last_event': `${eventName} ${params['target']}`,
            };
          });
          commandAPI('method', 'click', {'target': 'button'});

          expect(dlh.get('last_event')).toBe('click button');
        });

        it('can overwrite nested fields of the model', () => {
          dlh.registerProcessor('event', () => {
            return {
              'b': {'a': [3]},
            };
          });
          commandAPI('event');

          expect(dlh.get('b.a')).toEqual([3]);
        });

        it('can add new nested fields of the model', () => {
          dlh.registerProcessor('event', () => {
            return {
              'b': {'b': 2},
            };
          });
          commandAPI('event');

          expect(dlh.get('b')).toEqual({'a': [1], 'b': 2});
        });

        it('can update nested fields of the model', () => {
          dlh.registerProcessor('event', function() {
            const array = this.get('b.a');
            array.push(2);
            return {
              'b': {'a': array},
            };
          });
          commandAPI('event');

          expect(dlh.get('b')).toEqual({'a': [1, 2]});
        });

        it('sets the model according to the return value', () => {
          dataLayer.push({'a': {'b': 4, 'c': 'bad'}});
          dlh.registerProcessor('make good', () => {
            return {'a': {'c': 'good'}};
          });
          commandAPI('make good');

          expect(dlh.get('a')).toEqual({'b': 4, 'c': 'good'});
        });

        it('can access the abstract model interface through this', () => {
          dlh.registerProcessor('event', function() {
            const init = this.get('b.a');
            this.set('b.a', 'new');
            const end = this.get('b.a');

            expect(init).toEqual([1]);
            expect(end).toEqual('new');
          });
          commandAPI('event');

          expect(dlh.get('b')).toEqual({'a': 'new'});
        });
      });

  describe(`the registered command's connection to a command API`, () => {
    it('can call the command API', () => {
      dlh.registerProcessor('method', () => {
        spy('a');
        commandAPI('method2');
      });
      dlh.registerProcessor('method2', () => {
        spy('b');
      });
      commandAPI('method');

      expect(spy.calls.allArgs()).toEqual([['a'], ['b']]);
    });

    it('can call itself with command API', () => {
      dlh.registerProcessor('method', () => {
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
