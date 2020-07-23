/** @license Copyright 2012 Google Inc. All rights reserved. */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Data layer helper library.
 *
 * The dataLayer is a shared queue of objects holding generic information
 * about the page. It uses a standard set of keys so it can be read by anyone
 * that understands the spec (The spec is still under construction). It uses
 * a queue so that the page can record changes to its state. For example, a
 * page might start with the following dataLayer in its head section:
 *
 *   var dataLayer = [{
 *     title: 'Original page title'
 *   }];
 *
 * But in many situations (like an Ajax app), the state/data of the page can
 * change. Using a queue allows the page to update the data when that happens.
 * For example, if the title should change, the page can do this:
 *
 *   dataLayer.push({title: 'New page title'});
 *
 * Strictly speaking, this could have been done without a queue. But using a
 * queue allows readers of the dataLayer to come along at any time and process
 * the entire history of the page's data. This is especially useful for things
 * that load asynchronously or are deferred until long after the page
 * originally loads. But most importantly, using a queue allows all this
 * functionality without requiring a synchronous bootloader script slowing down
 * the page.
 *
 * @author bkuhn@google.com (Brian Kuhn)
 */

goog.module('helper');

const {type, hasOwn, isPlainObject} = goog.require('plain');

/**
 * @define {boolean} When true, potential code errors will be logged to the
 * console. To enable this, run yarn build-debug to compile the distribution
 * code.
 */
const DLH_DEBUG = goog.define('DLH_DEBUG', false);

/**
 * A helper that will listen for new messages on the given dataLayer.
 * Each new message will be merged into the helper's "abstract data model".
 * This internal model object holds the most recent value for all keys which
 * have been set on messages processed by the helper.
 *
 * You can retrieve values from the data model by using the helper's 'get'
 * method.
 */
class DataLayerHelper {
  /**
   * Creates a new helper object for the given dataLayer.
   *
   * @param {!Array<*>} dataLayer The dataLayer to help with.
   * @param {function(!Object<*>, !Object<*>)=} listener The callback
   *     function to execute when a new state gets pushed onto the dataLayer.
   * @param {boolean=} listenToPast If true, the given listener will be
   *     executed for state changes that have already happened.
   */
  constructor(dataLayer, listener = () => {
  }, listenToPast = false) {
    /**
     * The dataLayer to help with.
     * @private @const {!Array<*>}
     */
    this.dataLayer_ = dataLayer;

    /**
     * The listener to notify of changes to the dataLayer.
     * @private @const {function(!Object<*>, *)}
     */
    this.listener_ = listener;

    /**
     * The internal marker for checking if the listener
     * is currently on the stack.
     * @private {boolean}
     */
    this.executingListener_ = false;

    /**
     * The internal representation of the dataLayer's state at the time of the
     * update currently being processed.
     * @private @const {!Object<*>}
     */
    this.model_ = {};

    /**
     * The internal queue of dataLayer updates that have not yet been processed.
     * @private @const {!Array<*>}
     */
    this.unprocessed_ = [];

    /**
     * The internal map of processors to run.
     * @private @const {!Object<string, !Array<function(*):!Object>>}
     */
    this.commandProcessors_ = {};

    /**
     * The interface to the internal dataLayer model that is exposed to custom
     * methods. Custom methods will the executed with this interface as the
     * value of 'this', allowing users to manipulate the model using
     * this.get and this.set.
     * @private @const {!Object<*>}
     */
    this.abstractModelInterface_ = buildAbstractModelInterface_(this);

    // Process the existing/past states.
    this.processStates_(dataLayer, !listenToPast);
    // Add listener for future state changes.
    const oldPush = dataLayer.push;
    const that = this;
    dataLayer.push = function() {
      const states = [].slice.call(arguments, 0);
      const result = oldPush.apply(dataLayer, states);
      that.processStates_(states);
      return result;
    };
  }

  /**
   * Returns the value currently assigned to the given key in the helper's
   * internal model.
   *
   * @param {string} key The path of the key to set on the model, where dot (.)
   *     is the path separator.
   * @return {*} The value found at the given key.
   */
  get(key) {
    let target = this.model_;
    const split = key.split('.');
    for (let i = 0; i < split.length; i++) {
      if (target[split[i]] === undefined) return undefined;
      target = target[split[i]];
    }
    return target;
  }

  /**
   * Flattens the dataLayer's history into a single object that represents the
   * current state. This is useful for long running apps, where the dataLayer's
   * history may get very large.
   */
  flatten() {
    this.dataLayer_.splice(0, this.dataLayer_.length);
    this.dataLayer_[0] = {};
    merge_(this.model_, /** @type {!Object<*>} */ (this.dataLayer_[0]));
  }

  /**
   * Register a function to respond to events with a certain name called by
   * the command API by storing it in a map. The function will be called an
   * time the commandAPI is called with first parameter the string name.
   *
   * ---- USAGE ----
   * If the processor function is not an arrow function, then it can access the
   * abstract model interface by using the 'this' keyword. It is recommended
   * not to modify the state within the function using this.set.
   * Changes to the model should only be achieved by the return value, a
   * dict whose values will automatically be merged into the model.
   *
   * Example:
   * // Suppose that the abstract data model is currently {a: 1}.
   * dataLayerHelper.registerProcessor('add', function(numberToAdd) {
   *   const a = this.get('a');
   *   return {sum: numberToAdd + a};
   * });
   * // The abstract data model is still {a: 1}.
   * commandAPI('add', 2);
   * // The abstract data model is now {a: 1, sum: 3}.
   *
   * @param {string} name The string which should be passed into the command API
   *     to call the processor.
   * @param {function(*):!Object} processor The callback function to register.
   *    Will be invoked when an arguments object whose first parameter is name
   *    is pushed to the data layer.
   * @this {DataLayerHelper}
   */
  registerProcessor(name, processor) {
    if (!(name in this.commandProcessors_)) {
      this.commandProcessors_[name] = [];
    }
    this.commandProcessors_[name].push(processor);
  }

  /**
   * Applies the given command to the value in the dataLayer with the given key.
   * If a processor for the command has been registered, the processor function
   * will be invoked with any arguments passed in.
   *
   * @param {!Array<*>} args The arguments object containing the command
   *     to execute and optional arguments for the processor.
   * @return {!Array<!Object<*>>} states The updates requested to
   *     the model state, in the order they should be processed.
   * @private
   */
  processArguments_(args) {
    // Run all registered processors associated with this command.
    const states = [];
    const name = /** @type {string} */ (args[0]);
    if (this.commandProcessors_[name]) {
      // Cache length so as not to run processors registered
      // by other processors after the call.
      // This could happen if somebody calls the registerProcessor() method
      // within a processor call.
      const length = this.commandProcessors_[name].length;
      for (let i = 0; i < length; i++) {
        const callback = this.commandProcessors_[name][i];
        states.push(callback.apply(this.abstractModelInterface_,
            [].slice.call(args, 1)));
      }
    }
    return states;
  }

  /**
   * Merges the given update objects (states) onto the helper's model, calling
   * the listener each time the model is updated. If a command array is pushed
   * into the dataLayer, the method will be parsed and applied to the value
   * found at the key, if a one exists.
   *
   * @param {!Array<*>} states The update objects to process, each
   *     representing a change to the state of the page.
   * @param {boolean=} skipListener If true, the listener the given states
   *     will be applied to the internal model, but will not cause the listener
   *     to be executed. This is useful for processing past states that the
   *     listener might not care about.
   * @private
   */
  processStates_(states, skipListener = false) {
    this.unprocessed_.push.apply(this.unprocessed_, states);
    // Checking executingListener here protects against multiple levels of
    // loops trying to process the same queue. This can happen if the listener
    // itself is causing new states to be pushed onto the dataLayer.
    while (this.executingListener_ === false && this.unprocessed_.length > 0) {
      const update = this.unprocessed_.shift();
      if (isArray_(update)) {
        processCommand_(/** @type {!Array<*>} */ (update), this.model_);
      } else if (isArguments_(update)) {
        const newStates = this.processArguments_(
            /** @type {!Array<*>} */(update));
        this.unprocessed_.push.apply(this.unprocessed_, newStates);
      } else if (typeof update == 'function') {
        try {
          update.call(this.abstractModelInterface_);
        } catch (e) {
          // Catch any exceptions to we don't drop subsequent updates.
          logError(`An exception was thrown when running the method ` +
              `${update}, execution was skipped.`, LogLevel.ERROR);
          logError(e, LogLevel.ERROR);
        }
      } else if (isPlainObject(update)) {
        for (const key in update) {
          merge_(expandKeyValue_(key, update[key]), this.model_);
        }
      } else {
        continue;
      }
      if (!skipListener) {
        this.executingListener_ = true;
        this.listener_(this.model_, update);
        this.executingListener_ = false;
      }
    }
  }
}

window['DataLayerHelper'] = DataLayerHelper;

/**
 * Helper function that will build the abstract model interface using the
 * supplied dataLayerHelper.
 *
 * @param {!DataLayerHelper} dataLayerHelper The helper class to construct the
 *     abstract model interface for.
 * @return {!Object<*>} The interface to the abstract data layer model that is
 *     given to Custom Methods.
 * @private
 */
function buildAbstractModelInterface_(dataLayerHelper) {
  return {
    set(key, value) {
      merge_(expandKeyValue_(key, value),
          dataLayerHelper.model_);
    },
    get(key) {
      return dataLayerHelper.get(key);
    },
  };
}

/**
 * Applies the given method to the value in the dataLayer with the given key.
 * If the method is a valid function of the value, the method will be applies
 * with any arguments passed in.
 *
 * @param {!Array<*>} command The array containing the key with the
 *     method to execute and optional arguments for the method.
 * @param {!Object<*>} model The current dataLayer model.
 * @private
 */
function processCommand_(command, model) {
  if (!isString_(command[0])) {
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
 * @private
 */
function expandKeyValue_(key, value) {
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
 * @private
 */
function isArray_(value) {
  return type(value) === 'array';
}

/**
 * Determines if the given value is an arguments object.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is an arguments object.
 * @private
 */
function isArguments_(value) {
  return type(value) === 'arguments';
}

/**
 * Determines if the given value is a string.
 *
 * @param {*} value The value to test.
 * @return {boolean} True iff the given value is a string.
 * @private
 */
function isString_(value) {
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
 * @private
 */
function merge_(from, to) {
  const allowMerge = !from['_clear'];
  for (const property in from) {
    if (hasOwn(from, property)) {
      const fromProperty = from[property];
      if (isArray_(fromProperty) && allowMerge) {
        if (!isArray_(to[property])) to[property] = [];
        merge_(fromProperty, to[property]);
      } else if (isPlainObject(fromProperty) && allowMerge) {
        if (!isPlainObject(to[property])) to[property] = {};
        merge_(fromProperty, to[property]);
      } else {
        to[property] = fromProperty;
      }
    }
  }
  delete to['_clear'];
}

/**
 * Enum for choosing the level at which to log an error.
 * @readonly
 * @enum {number}
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
  DataLayerHelper,
  buildAbstractModelInterface_,
  processCommand_,
  expandKeyValue_,
  isArray_,
  isArguments_,
  isString_,
  merge_,
};
