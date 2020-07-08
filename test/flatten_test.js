goog.module('datalayerhelper.helper.testing.flatten');
goog.setTestOnly();

const {DataLayerHelper} = goog.require('helper');

describe(`The 'flatten' method of helper`, () => {
  beforeEach(function() {
    this.dataLayer = [{a: 1, b: {c: {d: 4}, e: 5}}];
    this.dataLayer.push({f: 6});
    this.dataLayer.push({g: 7});

    this.h = new DataLayerHelper(this.dataLayer);
    this.dataLayer.push({g: 8, i: 9});
    this.dataLayer.push({'b.c': 3});
  });

  it('compresses a complex history into 1 call', function() {
    expectEqualContents([
      {a: 1, b: {c: {d: 4}, e: 5}},
      {f: 6},
      {g: 7},
      {g: 8, i: 9},
      {'b.c': 3},
    ], this.dataLayer);

    this.h.flatten();

    expectEqualContents([{
      a: 1,
      b: {c: 3, e: 5},
      f: 6,
      g: 8,
      i: 9,
    }], this.dataLayer);
  });

  it('does nothing extra when called twice in a row', function() {
    this.h.flatten();
    this.h.flatten();

    expectEqualContents([
      {
        a: 1,
        b: {c: 3, e: 5},
        f: 6,
        g: 8,
        i: 9,
      }], this.dataLayer);
  });

  it('works properly when overwriting older values', function() {
    this.h.flatten();
    this.dataLayer.push({f: 7, j: 10});

    expectEqualContents([
      {
        a: 1,
        b: {c: 3, e: 5},
        f: 6,
        g: 8,
        i: 9,
      },
      {
        f: 7,
        j: 10,
      },
    ], this.dataLayer);

    this.h.flatten();

    expectEqualContents([{
      a: 1,
      b: {c: 3, e: 5},
      f: 7,
      g: 8,
      i: 9,
      j: 10,
    }], this.dataLayer);
  });
});
