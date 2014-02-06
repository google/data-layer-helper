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
    this.abstractModelInterface_ = helper.buildAbstractModelInterface_(this);
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

test('processStates_customMethods', function() {
  // Test the processing of Custom Methods.
  var customMethod = function() { this.set('a', 1); };
  assertProcessStates(
      [{a: 0}, customMethod],
      {a: 1},
      [[{a: 0}, {a: 0}], [{a: 1}, customMethod]]);

  customMethod = function() { this.set('b', 'one'); };
  assertProcessStates(
      [customMethod],
      {b: 'one'},
      [[{b: 'one'}, customMethod]]);

  customMethod = function() { this.set('c.d', [3]); };
  assertProcessStates(
      [customMethod],
      {c: {d: [3]}},
      [[{c: {d: [3]}}, customMethod]]);

  var customMethod = function() {
    var a = this.get('a');
    equal(1, a);
  };
  assertProcessStates(
      [{a: 1, b: 2}, customMethod],
      {a: 1, b: 2},
      [
        [{a: 1, b: 2}, {a: 1, b: 2}],
        [{a: 1, b: 2}, customMethod]
      ]);

  customMethod = function() {
    var b = this.get('a.b');
    equal(2, b);
  }
  assertProcessStates(
      [{a: {b: 2}}, customMethod],
      {a: {b: 2}},
      [
        [{a: {b: 2}}, {a: {b: 2}}],
        [{a: {b: 2}}, customMethod]
      ]);

  customMethod = function() {
    var a = this.get('a');
    equal(3, a.b.c[0]);
  };
  assertProcessStates(
      [{a: {b: {c: [3]}}}, customMethod],
      {a: {b: {c: [3]}}},
      [
        [{a: {b: {c: [3]}}}, {a: {b: {c: [3]}}}],
        [{a: {b: {c: [3]}}}, customMethod]
      ]);

  var products = [
    {price: 10},
    {price: 20},
    {price: 30}
  ];
  customMethod = function() {
    var products = this.get('products');
    this.set('numProducts', products.length);
  };
  assertProcessStates(
      [{'products': products}, customMethod],
      {'products': products, numProducts: 3},
      [
        [{'products': products}, {'products': products}],
        [{'products': products, numProducts: 3}, customMethod]
      ]);

  var expectedProducts = [
    {price: 10},
    {price: 20},
    {price: 60}
  ];
  customMethod = function() {
    var products = this.get('products');
    var lastProduct = products.pop();
    lastProduct.price = lastProduct.price * 2;
    products.push(lastProduct);
  }
  assertProcessStates(
      [{'products': products}, customMethod],
      {'products': expectedProducts},
      [
        [{'products': products}, {'products': products}],
        [{'products': expectedProducts}, customMethod]
      ]);

  customMethod = function() {
    var products = this.get('products');
    var total = 0;
    for (var i = 0; i < products.length; i++) {
      total += products[i].price;
    }
    this.set('orderTotal', total);
  }
  assertProcessStates(
      [{'products': products}, customMethod],
      {'products': products, orderTotal: 60},
      [
        [{'products': products}, {'products': products}],
        [{'products': products, orderTotal: 60}, customMethod]
      ]);

  // Test the behavior of processing custom methods where the methods throw
  // errors.
  var errorFunction = function() {
    throw 'Scary Error';
  };
  assertProcessStates([errorFunction], {} , [[{}, errorFunction]]);

  errorFunction = function() {
    this.set('a', 1);
    throw 'Scary Error';
    this.set('a', 2);
  };
  assertProcessStates(
      [errorFunction],
      {a: 1},
      [[{a: 1}, errorFunction]]);

  errorFunction = function() {
    this.set('a', 3);
    throw 'Scary Error';
    this.set('a', 4);
  };
  assertProcessStates(
      [{a: 1, b: 2}, errorFunction],
      {a: 3, b: 2},
      [
        [{a: 1, b: 2}, {a: 1, b: 2}],
        [{a: 3, b: 2}, errorFunction]
      ]);

  // Custom methods throwing errors shouldn't affect any messages further down
  // the queue.
  errorFunction = function() {
    this.set('a', 1);
    throw 'Scary Error';
  };
  assertProcessStates(
      [errorFunction, {a: 2}],
      {a: 2},
      [
        [{a: 1}, errorFunction],
        [{a: 2}, {a: 2}]
      ]);
});
