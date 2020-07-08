goog.module('datalayerhelper.helper.testing.get');
goog.setTestOnly();

const {DataLayerHelper} = goog.require('helper');

describe(`The 'get' function of helper`, () => {
  const h = new DataLayerHelper([{
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
    expect(h.get('b.f')).toBe(null);
  });

  it('returns undefined when key does not exist in model', () => {
    expect(h.get('blah')).toBe(undefined);
    expect(h.get('c')).toBe(undefined);
    expect(h.get('d')).toBe(undefined);
    expect(h.get('e')).toBe(undefined);
    expect(h.get('b.blah')).toBe(undefined);
    expect(h.get('b.blah.blah.blah')).toBe(undefined);
  });
});
