/**
 * @license jQuery v1.9.1 (c) 2005, 2012
 * jQuery Foundation, Inc. jquery.org/license.
 */

/**
 * @fileoverview Utility for categorizing JavaScript objects. The code in the
 * isPlainObject function was inspired by similar code in jQuery (hence the
 * above copyright notice).
 *
 * @author bkuhn@google.com (Brian Kuhn)
 */

goog.provide('plain');


/**
 * Pattern used by plain.type to match [object XXX] strings.
 * @type {RegExp}
 * @private
 * @const
 */
plain.TYPE_RE_ =
    /\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/;


/**
 * Returns a string describing the given value's type. Same as typeof, except
 * in these cases (assuming the value's typeof() method has not been modified):
 *
 *     value         |  typeof   |  type
 *    ======================================
 *     null          |  object   |  null
 *     new Boolean() |  object   |  boolean
 *     new Number()  |  object   |  number
 *     new String()  |  object   |  string
 *     new Date()    |  object   |  date
 *     [1,2,3]       |  object   |  array
 *     /.+/          |  object   |  regexp
 *
 * This method is also more reliable for detecting the type of objects created
 * in another window.
 *
 * @param {*} value The value to extract the type information from.
 * @return {string} The name of the given value's type.
 */
plain.type = function(value) {
  if (value == null) return String(value);
  var match = plain.TYPE_RE_.exec(
      Object.prototype.toString.call(Object(value)));
  if (match) return match[1].toLowerCase();
  return 'object';
};


/**
 * Determines if the value has a non-inherited property with the given key.
 *
 * @param {*} value The value to test.
 * @param {string} key The property name to look for.
 * @return {boolean} True iff the property exists.
 */
plain.hasOwn = function(value, key) {
  return Object.prototype.hasOwnProperty.call(Object(value), key);
};


/**
 * Determines if the given value is a "plain" object, meaning it's an object
 * with no inherited properties that isn't a null, date, regexp, array,
 * DOM node, or window object.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is a "plain" object.
 */
plain.isPlainObject = function(value) {
  if (!value || plain.type(value) != 'object' ||    // Nulls, dates, etc.
      value.nodeType ||                             // DOM nodes.
      value == value.window) {                      // Window objects.
    return false;
  }
  try {
    // According to jQuery, we must check for the presence of the constructor
    // property in IE. If the constructor property is inherited and isn't an
    // Object, this isn't a plain object.
    if (value.constructor && !plain.hasOwn(value, 'constructor') &&
        !plain.hasOwn(value.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
  } catch (e) {
    // Some objects will throw an exception when you try to access their
    // constructor. These are never plain objects.
    // See http://bugs.jquery.com/ticket/9897.
    return false;
  }
  // Lastly, we check that all properties are non-inherited.
  // According to jQuery, inherited properties are always enumerated last, so
  // it's safe to only check the last enumerated property.
  var key;
  for (key in value) {}
  return key === undefined || plain.hasOwn(value, key);
};

