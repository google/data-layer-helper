goog.module('datalayerhelper.helper.testing.isArray_');
goog.setTestOnly();

const {isArray_} = goog.require('helper');

describe('The helper.isArray_ function', function() {
  /**
   * Ensure that plain.IsPlainObject recognizes value
   * to be a array iff expected is true.
   * @param {*} value The value to check
   * @param {boolean} expected If the value is a plain object.
   */
  function assertIsArray(value, expected) {
    expect(isArray_(value)).toBe(expected);
  }

  it(`identifies things that aren't arrays as not arrays`, function() {
    assertIsArray(23, false);
    assertIsArray(NaN, false);
    assertIsArray(true, false);
    assertIsArray(false, false);
    assertIsArray(null, false);
    assertIsArray(undefined, false);
    assertIsArray('string', false);
    assertIsArray({a: 1}, false);
    assertIsArray(function() {}, false);
    assertIsArray(arguments, false);
    assertIsArray(window, false);
    assertIsArray(Array, false);
  });

  it(`identifies things that are arrays as arrays`, function() {
    assertIsArray([], true);
    assertIsArray([false], true);
    assertIsArray(Array(), true);
    assertIsArray(Array(false), true);
    assertIsArray(Object([]), true);
    assertIsArray(Object(Array()), true);
  });

  it('identifies arrays which were created in a different window.', function() {
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
    assertIsArray(x, true);
  });
});
