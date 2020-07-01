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

  describe('The function registration process', function() {
    it('allows registration of functions with arbitrary names', function() {
      let called = false;
      dlh.registerProcessor('!This funct%n @m@zing~0.0', function() {
        called = true;
      });
      commandAPI('!This funct%n @m@zing~0.0');

      expect(called).toBe(true);
    });

    /* TODO: no set command yet
    it('allows registration of functions with names that are in use',
        function() {
          let called = false;
          dlh.registerProcessor('set', () => {
            called = true;
          });
          commandAPI('set', 'one', 1);

          expect(dlh.get('one')).toBe(1);
          expect(called).toBe(true);
        });*/
  });

  describe('Order of calling registered functions', function() {
    it('calls registered functions only when the commandAPI' +
        'fires the appropriate event', function() {
      let x = 0;
      dlh.registerProcessor('process', function() {
        x = 1;
        dlh.registerProcessor('process', function() {
          x = 2;
        });
      });
      commandAPI('process');

      expect(x).toBe(1);
    });

    it('calls registered functions in the order they were registered',
        function() {
          let x = 0;
          dlh.registerProcessor('myMostFantasticFunction', function() {
            expect(x).toBe(0);
            x = 1;
          });
          dlh.registerProcessor('myMostFantasticFunction', function() {
            expect(x).toBe(1);
            x = 2;
          });
          dlh.registerProcessor('myMostFantasticFunction', function() {
            expect(x).toBe(2);
            x = 3;
          });
          commandAPI('myMostFantasticFunction');

          expect(x).toBe(3);
        });

    /* TODO: set command not defined yet. Also it might be good to add a test
     * with a listener
    it('considers built in functions to be registered first',
        function() {
          dlh.registerProcessor('set', function(key) {
            return {key: 3};
          });
          commandAPI('set', 'two', 2);

          expect(dlh.get('two')).toBe(3);
        });*/

    it('does not update the model until all processors have run', function() {
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

  describe('The parameters of a registered command', function() {
    it('can access the model through the this keyword', function() {
      dataLayer.push({'a': {'b': 4, 'c': 'bad'}}, {'x': []});
      dlh.registerProcessor('peek', function() {
        expect(this.get('a')).toEqual({'b': 4, 'c': 'bad'});
        expect(this.get('x')).toEqual([]);
      });
      commandAPI('peek');
    });

    it('takes any number of additional arguments passed to the command API',
        function() {
          dlh.registerProcessor('alphabet',
              function(a, b, c, d, e, f, g, h) {
                expect(a + b + c + d + e + f + g + h).toBe('abcdefgh');
              });
          commandAPI('alphabet', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        });

    it('can accept parameters of any type', function() {
      dlh.registerProcessor('method', function({array, date}, ...rest) {
        expect(array).toEqual([1, 6, 28]);
        expect(date).toEqual(new Date(2000, 0));
        expect(rest).toEqual([1, 'rats', 2006]);
      });
      commandAPI('method', {array: [1, 6, 28], date: new Date(2000, 0)},
          1, 'rats', 2006);
    });
  });

  describe(`The registered command's interface with the model`,
      function() {
        beforeEach(function() {
          dataLayer.push({'a': 1, 'b': {'a': [1]}});
        });

        it('can create a new field in the model', function() {
          dlh.registerProcessor('method', function(eventName, params) {
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

          expect(dlh.get('b.a')).toEqual([3]);
        });

        it('can add new nested fields of the model', function() {
          dlh.registerProcessor('event', () => {
            return {
              'b': {'b': 2},
            };
          });
          commandAPI('event');

          expect(dlh.get('b')).toEqual({'a': [1], 'b': 2});
        });

        it('can update nested fields of the model', function() {
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

        it('sets the model according to the return value', function() {
          dataLayer.push({'a': {'b': 4, 'c': 'bad'}});
          dlh.registerProcessor('make good', function() {
            return {'a': {'c': 'good'}};
          });
          commandAPI('make good');

          expect(dlh.get('a')).toEqual({'b': 4, 'c': 'good'});
        });

        it('can access the abstract model interface through this', function() {
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

  describe(`The registered command's connection to a command API`, function() {
    it('can call the command API', function() {
      let a = 1;
      dlh.registerProcessor('method', function() {
        a += 2;
        commandAPI('method2');
      });
      dlh.registerProcessor('method2', function() {
        a += 4;
      });
      commandAPI('method');

      expect(a).toBe(7);
    });

    it('can call the itself with command API', function() {
      let a = 0;
      dlh.registerProcessor('method', function() {
        if (a < 10) {
          a++;
          commandAPI('method');
        }
      });
      commandAPI('method');

      expect(a).toBe(10);
    });
  });
});
