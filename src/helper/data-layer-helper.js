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
 *   const dataLayer = [{
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

goog.module('dataLayerHelper.helper.DataLayerHelper');
const {LogLevel, log} = goog.require('dataLayerHelper.logging');
const {expandKeyValue, isArray, isString, isArguments, merge} = goog.require('dataLayerHelper.helper.utils');
const {isPlainObject, type} = goog.require('dataLayerHelper.plain');

/**
 * @typedef {{
 *   listener: (function(!Object<string, *>, *)|undefined),
 *   listenToPast: (boolean|undefined),
 *   processNow: (boolean|undefined),
 *   commandProcessors: (!Object<string,
 *       !Array<function(...):(!Object<string, *>|undefined)>>|undefined)
 * }}
 */
const DataLayerOptions = {};

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
   * @param {(!DataLayerOptions|
   *     (function(!Object<string, *>, *):undefined))=} options
   * @param {boolean=} listenToPast
   */
  constructor(dataLayer, options = {}, listenToPast = false) {
    // Legacy invocation
    if (typeof options === 'function') {
      log(`Legacy constructor was used. ` +
          `See README for latest usage.`, LogLevel.WARNING);
      // Use only quoted keys for options, or the compiler
      // may produce unexpected behavior.
      options = {
        'listener': options,
        'listenToPast': listenToPast,
        'processNow': true,
        'commandProcessors': {},
      };
    } else {
      options = {
        'listener': options['listener'] || (() => {
        }),
        'listenToPast': options['listenToPast'] || false,
        'processNow': options['processNow'] === undefined ?
            true : options['processNow'],
        'commandProcessors': options['commandProcessors'] || {},
      };
    }

    /**
     * The dataLayer to help with.
     * @private @const {!Array<*>}
     */
    this.dataLayer_ = dataLayer;

    /**
     * The listener to notify of changes to the dataLayer.
     * @private @const {function(!Object<string, *>, *)}
     */
    this.listener_ = options['listener'];

    /**
     * The internal marker for checking if the listener
     * should be called for previous state changes.
     */
    this.listenToPast_ = options['listenToPast'];

    /**
     * The internal marker for checking if the helper has been processed.
     * @private {boolean}
     */
    this.processed_ = false;

    /**
     * The internal marker for checking if the listener
     * is currently on the stack.
     * @private {boolean}
     */
    this.executingListener_ = false;

    /**
     * The internal representation of the dataLayer's state at the time of the
     * update currently being processed.
     * @private @const {!Object<string, *>}
     */
    this.model_ = {};

    /**
     * The internal queue of dataLayer updates that have not yet been processed
     * because another command is in the process of running.
     * @private @const {!Array<*>}
     */
    this.unprocessed_ = [];

    /**
     * The internal map of processors to run.
     * @private @const {!Object<string,
     *     !Array<function(...):(!Object<string, *>|undefined)>>}
     */
    this.commandProcessors_ = options['commandProcessors'];

    /**
     * The interface to the internal dataLayer model that is exposed to custom
     * methods. Custom methods will the executed with this interface as the
     * value of 'this', allowing users to manipulate the model using
     * this.get and this.set.
     * @private @const {!Object<string, *>}
     */
    this.abstractModelInterface_ = buildAbstractModelInterface_(this);

    // Add listener for future state changes.
    const oldPush = this.dataLayer_.push;
    const that = this;
    this.dataLayer_.push = function() {
      const states = [].slice.call(arguments, 0);
      const result = oldPush.apply(that.dataLayer_, states);
      that.processStates_(states);
      return result;
    };

    if (options['processNow']) {
      this.process();
    }
  }

  /**
   * Processes the current dataLayer and registers the set command.
   * The helper will not respond to pushes to the dataLayer until
   * this method has been executed. Unless the processNow argument is
   * intentionally set to false via the constructor, this method will
   * always execute at construction time.
   *
   * Note: This method should only be called a single time to prepare
   * the helper.
   * @export
   */
  process() {
    if (this.processed_) {
      log(`Process has already been run. This method should only ` +
        `run a single time to prepare the helper.`, LogLevel.ERROR);
    }

    // Register a processor for set command.
    this.registerProcessor('set', function() {
      let toMerge = {};
      if (arguments.length === 1 && type(arguments[0]) === 'object') {
        toMerge = arguments[0];
      } else if (arguments.length === 2 && type(arguments[0]) === 'string') {
        // Maintain consistency with how objects are merged
        // outside of the set command (overwrite or recursively merge).
        toMerge = expandKeyValue(arguments[0], arguments[1]);
      }
      return toMerge;
    });
    // Mark helper as having been processed.
    this.processed_ = true;

    const startingLength = this.dataLayer_.length;
    for (let i = 0; i < startingLength; i++) {
     // Run the commands one at a time to maintain the correct
     // length of the queue on each command.
     this.processStates_([this.dataLayer_[i]], !(this.listenToPast_));
    }
  }

  /**
   * Returns the value currently assigned to the given key in the helper's
   * internal model.
   *
   * @param {string} key The path of the key to set on the model, where dot (.)
   *     is the path separator.
   * @return {*} The value found at the given key.
   * @export
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
   * Use of this method with a command API is not supported and may break
   * something.
   * @export
   */
  flatten() {
    this.dataLayer_.splice(0, this.dataLayer_.length);
    this.dataLayer_[0] = {};
    merge(this.model_, /** @type {!Object<string, *>} */ (this.dataLayer_[0]));
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
   * @param {function(...):(!Object|undefined)} processor The callback function
   *    to register. Will be invoked when an arguments object whose first
   *    parameter is name is pushed to the data layer.
   * @this {DataLayerHelper}
   * @export
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
   * @return {!Array<!Object<string, *>>} states The updates requested to
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
   * @param {boolean=} skipListener If true, the existing states
   *     will be applied to the internal model, but will not cause the listener
   *     to be executed. This is useful for processing past states that the
   *     listener might not care about.
   * @private
   */
  processStates_(states, skipListener = false) {
    if (!this.processed_) {
      return;
    }
    this.unprocessed_.push.apply(this.unprocessed_, states);
    if (this.executingListener_) {
      return;
    }
    // Checking executingListener here protects against multiple levels of
    // loops trying to process the same queue. This can happen if the listener
    // itself is causing new states to be pushed onto the dataLayer.
    while (this.unprocessed_.length > 0) {
      const update = this.unprocessed_.shift();
      if (isArray(update)) {
        processCommand_(/** @type {!Array<*>} */ (update), this.model_);
      } else if (isArguments(update)) {
        const newStates = this.processArguments_(
            /** @type {!Array<*>} */(update));
        this.unprocessed_.push.apply(this.unprocessed_, newStates);
      } else if (typeof update == 'function') {
        try {
          update.call(this.abstractModelInterface_);
        } catch (e) {
          // Catch any exceptions to we don't drop subsequent updates.
          log(`An exception was thrown when running the method ` +
              `${update}, execution was skipped.`, LogLevel.ERROR);
          log(e, LogLevel.ERROR);
        }
      } else if (isPlainObject(update)) {
        for (const key in update) {
          merge(expandKeyValue(key, update[key]), this.model_);
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
 * @return {!Object<string, *>} The interface to the abstract data layer model
 *     that is given to Custom Methods.
 * @private
 */
function buildAbstractModelInterface_(dataLayerHelper) {
  return {
    set(key, value) {
      merge(expandKeyValue(key, value),
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
 * @param {!Object<string, *>} model The current dataLayer model.
 * @private
 */
function processCommand_(command, model) {
  if (!isString(command[0])) {
    log(`Error processing command, no command was run. The first ` +
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
      log(`Error processing command, no command was run as the ` +
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
    log(`An exception was thrown by the method ` +
        `${method}, so no command was run.\nThe method was called on the ` +
        `data layer object at the location ${path}.`, LogLevel.ERROR);
  }
}

exports = DataLayerHelper;
