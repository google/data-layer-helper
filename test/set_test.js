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

  describe('The set command, 2 argument format', function() {
    it('Set command updates model without corrupting it.', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'bar');
      targetModel['foo'] = 'bar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('Set command no-op, unecpected number of arguments: 0 args', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('Set command no-op, unecpected number of arguments: 4 args', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'bar', 'extra');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('Set command no-op, unecpected type for first argument', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 2, 'bar');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('Set command updates existing key with new val', function() {
      const targetModel = Object.assign({}, dlh.abstractModelInterface_);
      commandAPI('set', 'foo', 'newBar');
      targetModel['foo'] = 'newBar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });
  });

  describe('The set command, 1 argument format', function() {
    it('Single key-val pair, Set command updates model without corruption.',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'yes': 'no'});
          targetModel['yes'] = 'no';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('Multiple key-val pair, Set command updates model without corruption.',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', {'yes': 'no', 'hello': 'world', 'goodbye': 'bluesky'});
          targetModel['yes'] = 'no';
          targetModel['hello'] = 'world';
          targetModel['goodbye'] = 'bluesky';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('Multiple key-val pair, Set command no-op when not an object',
        function() {
          const targetModel = Object.assign({}, dlh.abstractModelInterface_);
          commandAPI('set', 'no op');

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );
  });
});
