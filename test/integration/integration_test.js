describe('the data layer helper library', function() {
  it('does not pollute the global scope', function() {
    expect(window['dataLayer']).toBe(undefined);
    expect(window['goog']).toBe(undefined);
    expect(window['helper']).toBe(undefined);
    expect(window['plain']).toBe(undefined);
    expect(window['isPlainObject']).toBe(undefined);
    expect(window['explandKeyValue_']).toBe(undefined);
  });

  it('only exposes the DataLayerHelper constructor with get and ' +
    'flatten methods', function() {
    let helper = new DataLayerHelper([]);
    expect(typeof DataLayerHelper).toBe('function');
    expect(helper.get).toBe('function');
    expect(helper.flatten).toBe('function');
    expect(helper.processStates_).toBe(undefined);
    expect(helper.expandKeyValue_).toBe(undefined);
    expect(helper.isArray_).toBe(undefined);
    expect(helper.merge_).toBe(undefined);
  });



});
