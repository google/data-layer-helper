goog.module('dataLayerHelper.helper.utils');

const {type, hasOwn, isPlainObject} = goog.require('dataLayerHelper.plain');

/**
 * Converts the given key value pair into an object that can be merged onto
 * another object. Specifically, this method treats dots in the key as path
 * separators, so the key/value pair:
 *
 *   'a.b.c', 1
 *
 * will become the object:
 *
 *   {a: {b: {c: 1}}}
 *
 * @param {string} key The key's path, where dots are the path separators.
 * @param {*} value The value to set on the given key path.
 * @return {!Object<string, *>} An object representing the given key/value
 *     which can be merged onto the dataLayer's model.
 * @package
 */
function expandKeyValue(key, value) {
  const result = {};
  let target = result;
  const split = key.split('.');
  for (let i = 0; i < split.length - 1; i++) {
    target = target[split[i]] = {};
  }
  target[split[split.length - 1]] = value;
  return result;
}

/**
 * Determines if the given value is an array.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is an array.
 * @package
 */
function isArray(value) {
  return type(value) === 'array';
}

/**
 * Determines if the given value is an arguments object.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is an arguments object.
 * @package
 */
function isArguments(value) {
  return type(value) === 'arguments';
}

/**
 * Determines if the given value is a string.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is a string.
 * @package
 */
function isString(value) {
  return type(value) === 'string';
}

/**
 * Merges one object into another or one array into another. Scalars and
 * "non-plain" objects are overwritten when there is a merge conflict.
 * Arrays and "plain" objects are merged recursively.
 *
 * TODO(bkuhn): This is just a starting point for how we'll decide which
 * objects get cloned and which get copied. More work is needed to flesh
 * out the details here.
 *
 * @param {!Array<*>|!Object<string, *>} from The object or array to merge from.
 * @param {!Array<*>|!Object<string, *>} to The object or array to merge into.
 * @package
 */
function merge(from, to) {
  const allowMerge = !from['_clear'];
  for (const property in from) {
    if (hasOwn(from, property)) {
      const fromProperty = from[property];
      if (isArray(fromProperty) && allowMerge) {
        if (!isArray(to[property])) to[property] = [];
        merge(fromProperty, to[property]);
      } else if (isPlainObject(fromProperty) && allowMerge) {
        if (!isPlainObject(to[property])) to[property] = {};
        merge(fromProperty, to[property]);
      } else {
        to[property] = fromProperty;
      }
    }
  }
  delete to['_clear'];
}

exports = {
  expandKeyValue,
  isArray,
  isString,
  isArguments,
  merge,
};
