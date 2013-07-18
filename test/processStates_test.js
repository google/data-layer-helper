/**
 * Copyright 2012 Google Inc. All rights reserved.
 *
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
 * @fileoverview Unit tests for processStates().
 * @author bnkuhn@gmail.com (Brian Kuhn)
 */

/**
 * Asserts that calling processStates_ with the given arguments will result
 * in the expected model state and expected calls to the listener.
 *
 * @param {Array.<Object>} states The states argument for the call to
 *     processStates_.
 * @param {Object} expectedModel The expected model state after the call.
 * @param {Array.<Array.<*>>} expectedListenerCalls The exepected calls made
 *     to the helper's listener. Should be an array of arrays where each sub-
 *     array represents the arguments passed to the listener during a call.
 */
function assertProcessStates(states, expectedModel, expectedListenerCalls) {
  var MockHelper = function() {
    this.model_ = {};
    this.unprocessed_ = [];
    this.executingListener_ = false;
    this.listenerCalls_ = [];
    this.listener_ = function() {
      this.listenerCalls_.push(
          jQuery.extend(true, [], [].slice.call(arguments, 0)));
    };
  };
  function doAssert(skipListener) {
    MockHelper.prototype = new DataLayerHelper([]);
    var helper = new MockHelper();
    DataLayerHelper.prototype.processStates_.call(helper, states, skipListener);
    deepEqual(helper.model_, expectedModel);
    deepEqual(helper.listenerCalls_, skipListener ? [] : expectedListenerCalls);
    deepEqual(helper.unprocessed_, []);
    equal(helper.executingListener_, false);
  }
  doAssert(true);
  doAssert(false);
}

test('processStates', function() {
  assertProcessStates([], {}, []);
  assertProcessStates([{a: 1}], {a: 1}, [[{a: 1}, {a: 1}]]);
  assertProcessStates([{a: 1}, {a: 2}], {a: 2},
      [[{a: 1}, {a: 1}], [{a: 2}, {a: 2}]]);
  assertProcessStates([{'a.b': 1}], {a: {b: 1}},
      [[{a: {b: 1}}, {'a.b': 1}]]);
});

