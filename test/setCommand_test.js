goog.module('data_layer_helper.helper.testing.setCommand');
goog.setTestOnly();

const DataLayerHelper = goog.require('data_layer_helper.helper.DataLayerHelper');

describe('The set command', () => {
  let dataLayer;
  let dlh;
  let targetModel;
  let commandAPI;

  beforeAll(() => {
    commandAPI = function() {
      dataLayer.push(arguments);
    };
  });

  beforeEach(() => {
    dataLayer = [];
    dlh = new DataLayerHelper(dataLayer);
    commandAPI('set', 'bar', 'foo');
    targetModel = Object.assign({}, dlh.abstractModelInterface_);
  });

  describe('with 2 argument format', () => {
    it('updates model without corrupting it.', () => {
      commandAPI('set', 'foo', 'bar');
      targetModel['foo'] = 'bar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('updates model using dot-notation without corrupting it.', () => {
      commandAPI('set', 'foobar.barfoo.val', 'testVal');
      targetModel['foobar'] = {'barfoo': {'val': 'testVal'}};

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with unecpected number of arguments(0 args)', () => {
      commandAPI('set');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with unecpected number of arguments: 3 args', () => {
      commandAPI('set', 'foo', 'bar', 'extra');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('results in no-op with an unecpected type for 1st argument', () => {
      commandAPI('set', 2, 'bar');

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });

    it('updates existing key with new val', () => {
      commandAPI('set', 'foo', 'newBar');
      targetModel['foo'] = 'newBar';

      expect(dlh.abstractModelInterface_).toEqual(targetModel);
    });
  });

  describe('with 1 argument format', () => {
    it('updates model without corruption with a single key- val pair',
        () => {
          commandAPI('set', {'yes': 'no'});
          targetModel['yes'] = 'no';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model without corruption with multiple key-val pairs',
        () => {
          commandAPI('set',
            {'yes': 'no', 'hello': 'world', 'goodbye': 'bluesky'});
          targetModel['yes'] = 'no';
          targetModel['hello'] = 'world';
          targetModel['goodbye'] = 'bluesky';

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model without corruption with nested key-val pairs',
        () => {
          commandAPI('set', {'yes': {'yes': 'no', 'no': 'yes'}});
          targetModel['yes'] = {'yes': 'no', 'no': 'yes'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {'yes': {'yes': 'yes'}});
          targetModel['yes'] = {'yes': 'yes', 'no': 'yes'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model by merging existing array with a new one',
        () => {
          commandAPI('set', {'array': [1, 2, 3]});
          targetModel['array'] = [1, 2, 3];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          const testArray = [];
          testArray[3] = 4;
          testArray[4] = 5;
          testArray[5] = 6;
          commandAPI('set', {'array': testArray});
          targetModel['array'] = [1, 2, 3, 4, 5, 6];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          const testArray2 = [undefined, undefined, undefined];
          commandAPI('set', {'array': testArray2});
          targetModel['array'] = [undefined, undefined, undefined, 4, 5, 6];

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('updates model by merging existing object with a new one',
        () => {
          commandAPI('set', {'object': {'test': 'value'}});
          targetModel['object'] = {'test': 'value'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);

          commandAPI('set', {'object': {'value': 'test'}});
          targetModel['object'] = {'value': 'test', 'test': 'value'};

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );

    it('results in no-op when single argument is not an object',
        () => {
          commandAPI('set', 'no op');

          expect(dlh.abstractModelInterface_).toEqual(targetModel);
        }
    );
  });
});
