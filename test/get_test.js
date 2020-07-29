goog.module('dataLayerHelper.helper.testing.get');
goog.setTestOnly();

const DataLayerHelper = goog.require('dataLayerHelper.helper.DataLayerHelper');

describe('The `get` function of helper', () => {
  const h = new DataLayerHelper(/* dataLayer= */[{
    a: 1,
    b: {
      c: {
        d: 4,
      },
      e: 5,
      f: null,
    },
  }]);

  it('returns the value currently assigned ' +
      'to the given key in the helper internal model', () => {
    expect(h.get('a')).toBe(1);
    expect(h.get('b')).toEqual({c: {d: 4}, e: 5, f: null});
    expect(h.get('b.c')).toEqual({d: 4});
    expect(h.get('b.c.d')).toBe(4);
    expect(h.get('b.e')).toBe(5);
    expect(h.get('b.f')).toBeNull();
  });

  it('returns undefined when key does not exist in model', () => {
    expect(h.get('blah')).toBeUndefined();
    expect(h.get('c')).toBeUndefined();
    expect(h.get('d')).toBeUndefined();
    expect(h.get('e')).toBeUndefined();
    expect(h.get('b.blah')).toBeUndefined();
    expect(h.get('b.blah.blah.blah')).toBeUndefined();
  });
});
