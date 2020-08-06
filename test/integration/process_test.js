describe('The process function of helper', () => {
  let dataLayer;
  let commandAPI;

  beforeEach(() => {
    dataLayer = [];
    commandAPI = function() {
      dataLayer.push(arguments);
    };
  });

  it('processes all existing plain objects when process is called', () => {
    dataLayer.push({'a': 4});
    const helper = new DataLayerHelper(dataLayer,
        {processNow: false});
    dataLayer.push({'b': 5});

    expect(helper.get('a')).toBeUndefined();
    expect(helper.get('b')).toBeUndefined();
    helper.process();

    expect(helper.get('a')).toBe(4);
    expect(helper.get('b')).toBe(5);
  });

  it('uses newly registered processors on old events', () => {
    const spy = jasmine.createSpy('spy');
    commandAPI('event');
    commandAPI('fireworks');

    const helper = new DataLayerHelper(dataLayer,
        {processNow: false});
    helper.registerProcessor('event', () => {
      helper.registerProcessor('fireworks', spy);
    });

    expect(spy).not.toHaveBeenCalled();
    helper.process();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
