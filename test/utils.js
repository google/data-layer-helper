/**
 * Checks that each of the values of two array-like objects are deep equal.
 * This is needed because jasmine's toEqual compares the functional
 * attributes of dataLayer, which includes a push function.
 * Since the push function is an anonymous function that gets
 * recreated every time, we can't create an object that
 * is deep equal to any dataLayer.
 * @param {!Array<Object>} arr1 The first array-like object
 * @param {!Array<Object>} arr2 The second array-like object
 */
function expectEqualContents(arr1, arr2) {
  expect(arr1.length).toBe(arr2.length);
  for (let i = 0; i < arr1.length; i++) {
    expect(arr1[i]).toEqual(arr2[i]);
  }
}
