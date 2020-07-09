/**
 * Checks that each an array is deep equal to the dataLayer array.
 * This is needed because jasmine's toEqual compares the functional
 * attributes of dataLayer, which includes a push function.
 * Since the push function is an anonymous function that gets
 * recreated every time, we can't create an object that
 * is deep equal to any dataLayer according to jasmine.
 * @param {!Array<*>} expected The array we expect the data layer to look like.
 * @param {!Array<*>} dataLayer The dataLayer
 */
function expectDataLayerEquals(expected, dataLayer) {
  expect(expected.length).toBe(dataLayer.length);
  for (let i = 0; i < expected.length; i++) {
    expect(expected[i]).toEqual(dataLayer[i]);
  }
}
