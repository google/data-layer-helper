goog.module('dataLayerHelper.helper.utils.testing.isArray');
goog.setTestOnly();

const {isArray} = goog.require('dataLayerHelper.helper.utils');

describe('The `isArray` function of helper', () => {
  /**
   * Ensure that the isArray function recognizes value
   * to be a array.
   * @param {*} value The value to check.
   */
  function assertIsArray(value) {
    expect(isArray(value)).toBe(true);
  }

  /**
   * Ensure that the isArray function does not
   * recognize the value to be an array.
   * @param {*} value The value to check.
   */
  function assertIsNotArray(value) {
    expect(isArray(value)).toBe(false);
  }

  it(`identifies things that aren't arrays as not arrays`, () => {
    assertIsNotArray(23);
    assertIsNotArray(NaN);
    assertIsNotArray(true);
    assertIsNotArray(false);
    assertIsNotArray(null);
    assertIsNotArray(undefined);
    assertIsNotArray('string');
    assertIsNotArray({a: 1});
    assertIsNotArray(function() {});
    assertIsNotArray(arguments);
    assertIsNotArray(window);
    assertIsNotArray(Array);
  });

  it('identifies things that are arrays as arrays', () => {
    assertIsArray([]);
    assertIsArray([false]);
    assertIsArray(Array());
    assertIsArray(Array(false));
    assertIsArray(Object([]));
    assertIsArray(Object(Array()));
  });

  it('identifies arrays which were created in a different window.', () => {
    const iframe = document.createElement('iframe');
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.write(`<script>var x = ["hello"];</script>`);

    const x = iframe.contentWindow.x;

    expect(x[0]).toBe('hello');
    expect(x instanceof Array).toBe(false);
    assertIsArray(x);
  });
});
