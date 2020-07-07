/* eslint-disable closure/indent */
goog.require('helper');

describe('The set command', function() {
  let dataLayer;
  let dlh;
  let commandAPI;
  beforeAll(function() {
    dataLayer = [];
    commandAPI = function() {
      dataLayer.push(arguments);
    };
    dlh = new helper.DataLayerHelper(dataLayer);
    commandAPI('set', 'bar', 'foo');
  });

  describe('with 2 argument format', function() {
    it('updates model without corrupting it.', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'bar');
      targetModel['foo'] = 'bar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('updates model using dot-notation without corrupting it.', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foobar.barfoo.val', 'testVal');
      targetModel['foobar'] = {'barfoo': {'val': 'testVal'}};

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with unecpected number of arguments(0 args)', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with unecpected number of arguments: 3 args', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'bar', 'extra');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with an unecpected type for 1st argument', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 2, 'bar');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('updates existing key with new val', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'newBar');
      targetModel['foo'] = 'newBar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });
  });

  describe('with 1 argument format', function() {
    it('updates model without corruption with a single key- val pair',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'yes': 'no'});
          targetModel['yes'] = 'no';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model without corruption with multiple key-val pairs',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'yes': 'no', 'hello': 'world', 'goodbye': 'bluesky'});
          targetModel['yes'] = 'no';
          targetModel['hello'] = 'world';
          targetModel['goodbye'] = 'bluesky';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model without corruption with nested key-val pairs',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'yes': {'yes': 'no', 'no': 'yes'}});
          targetModel['yes'] = {'yes': 'no', 'no': 'yes'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {'yes': {'yes': 'yes'}});
          targetModel['yes'] = {'yes': 'yes', 'no': 'yes'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model by merging existing array with a new one',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'array': [1, 2, 3]});
          targetModel['array'] = [1, 2, 3];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {'array': [undefined, undefined, undefined, 4, 5, 6]});
          targetModel['array'] = [1, 2, 3, 4, 5, 6];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {"array": [undefined, undefined, undefined, undefined, undefined, undefined, 1]});
          targetModel['array'] = [1, 2, 3, 4, 5, 6, 1];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model by merging existing object with a new one',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'object': {'test': 'value'}});
          targetModel['object'] = {'test': 'value'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {'object': {'value': 'test'}});
          targetModel['object'] = {'value': 'test', 'test': 'value'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('results in no-op when single argument is not an object',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', 'no op');

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );
  });
});
