goog.module('datalayerhelper.helper.utils');

const {type, hasOwn, isPlainObject} = goog.require('datalayerhelper.plain');

/**
 * Applies the given method to the value in the dataLayer with the given key.
 * If the method is a valid function of the value, the method will be applies
 * with any arguments passed in.
 *
 * @param {!Array<*>} command The array containing the key with the
 *     method to execute and optional arguments for the method.
 * @param {!Object<*>} model The current dataLayer model.
 * @package
 */
function processCommand(command, model) {
  if (!isString(command[0])) {
    logError(`Error processing command, no command was run. The first ` +
        `argument must be of type string, but was of type ` +
        `${typeof command[0]}.\nThe command run was ${command}`,
        LogLevel.WARNING);
  }
  const path = command[0].split('.');
  const method = path.pop();
  const args = command.slice(1);
  let target = model;
  for (let i = 0; i < path.length; i++) {
    if (target[path[i]] === undefined) {
      logError(`Error processing command, no command was run as the ` +
          `object at ${path} was undefined.\nThe command run was ${command}`,
          LogLevel.WARNING);
      return;
    }
    target = target[path[i]];
  }
  try {
    target[method].apply(target, args);
  } catch (e) {
    // Catch any exception so we don't drop subsequent updates.
    logError(`An exception was thrown by the method ` +
        `${method}, so no command was run.\nThe method was called on the ` +
        `data layer object at the location ${path}.`, LogLevel.ERROR);
  }
}

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
 * @return {!Object<*>} An object representing the given key/value which can be
 *     merged onto the dataLayer's model.
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
 * @param {!Array<*>|!Object<*>} from The object or array to merge from.
 * @param {!Array<*>|!Object<*>} to The object or array to merge into.
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


/**
 * @define {boolean} When true, potential code errors will be logged to the
 * console. To enable this, run yarn build-debug to compile the distribution
 * code.
 */
const DLH_DEBUG = goog.define('DLH_DEBUG', false);

/**
 * Enum for choosing the level at which to log an error.
 * @readonly
 * @enum {number}
 * @package
 */
const LogLevel = {
  LOG: 1,
  WARNING: 2,
  ERROR: 3,
};

/**
 * Log an error to the console if the debug distribution is in use.
 *
 * @param {string} toLog The error to log to the console in debug mode.
 * @param {!LogLevel} logLevel The error to log to the console in debug mode.
 * @package
 */
function logError(toLog, logLevel) {
  if (DLH_DEBUG) {
    switch (logLevel) {
      case LogLevel.LOG:
        console.log(toLog);
        break;
      case LogLevel.WARNING:
        console.warn(toLog);
        break;
      case LogLevel.ERROR:
        console.error(toLog);
        break;
      default:
    }
  }
}

exports = {
  processCommand,
  expandKeyValue,
  isArray,
  isArguments,
  merge,
  LogLevel,
  logError,
};
