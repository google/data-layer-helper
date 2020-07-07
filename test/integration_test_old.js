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

test('no pollution of global scope', function() {
  function noGlobal(name) {
    ok(window[name] === undefined);
  }
  noGlobal('dataLayer');
  noGlobal('goog');
  noGlobal('helper');
  noGlobal('plain');
  noGlobal('isPlainObject');
  noGlobal('expandKeyValue_');
});

test('DataLayerHelper API', function() {
  ok(typeof DataLayerHelper === 'function');
  var helper = new DataLayerHelper([]);
  ok(typeof helper.get === 'function');
  ok(typeof helper.flatten === 'function');
  ok(helper.processStates_ === undefined);
  ok(helper.expandKeyValue_ === undefined);
  ok(helper.isArray_ === undefined);
  ok(helper.merge_ === undefined);
});

test('Basic Operations', function() {
  var callbacks = [];
  var expectedCallbackCount = 0;
  function assertCallback(expected) {
    expectedCallbackCount++;
    ok(callbacks.length, expectedCallbackCount);
    deepEqual(callbacks[callbacks.length - 1], expected);
  }
  function callbackListener() {
    callbacks.push([].slice.call(arguments, 0));
  }

  var dataLayer = [];
  var helper = new DataLayerHelper(dataLayer, callbackListener);

  equal(callbacks.length, 0);
  ok(helper.get('one') === undefined);
  ok(helper.get('two') === undefined);

  dataLayer.push({one: 1, two: 2});
  assertCallback([{one: 1, two: 2}, {one: 1, two: 2}]);
  ok(helper.get('one') === 1);
  ok(helper.get('two') === 2);

  dataLayer.push({two: 3});
  assertCallback([{one: 1, two: 3}, {two: 3}]);
  ok(helper.get('one') === 1);
  ok(helper.get('two') === 3);

  dataLayer.push({two: 2});
  assertCallback([{one: 1, two: 2}, {two: 2}]);
  ok(helper.get('one') === 1);
  ok(helper.get('two') === 2);

  dataLayer.push({one: {three: 3}});
  assertCallback([{one: {three: 3}, two: 2}, {one: {three: 3}}]);
  deepEqual(helper.get('one'), {three: 3});
  ok(helper.get('two') === 2);

  dataLayer.push({one: {four: 4}});
  assertCallback([{one: {three: 3, four: 4}, two: 2}, {one: {four: 4}}]);
  deepEqual(helper.get('one'), {three: 3, four: 4});
  ok(helper.get('one.four') === 4);
  ok(helper.get('two') === 2);

  equal(dataLayer.length, 5);
  deepEqual(dataLayer, [{one: 1, two: 2}, {two: 3}, {two: 2}, {one: {three: 3}}, {one: {four: 4}}]);
  helper.flatten();
  equal(dataLayer.length, 1);
  deepEqual(dataLayer, [{one: {three: 3, four: 4}, two: 2}]);
  deepEqual(helper.get('one'), {three: 3, four: 4});
  ok(helper.get('one.four') === 4);
  ok(helper.get('two') === 2);

  dataLayer.push({five: 5});
  assertCallback([{one: {three: 3, four: 4}, two: 2, five: 5}, {five: 5}]);
  equal(dataLayer.length, 2);
  ok(helper.get('one.four') === 4);
  ok(helper.get('five') === 5);
});

test('Advanced Operations', function() {
  var callbacks = [];
  var expectedCallbackCount = 0;
  function assertCallback(expected) {
    expectedCallbackCount++;
    ok(callbacks.length, expectedCallbackCount);
    deepEqual(callbacks[callbacks.length - 1], expected);
  }
  function callbackListener() {
    callbacks.push([].slice.call(arguments, 0));
  }

  var dataLayer = [];
  var helper = new DataLayerHelper(dataLayer, callbackListener);

  equal(callbacks.length, 0);
  ok(helper.get('one') === undefined);
  ok(helper.get('two') === undefined);

  // Test pushing a custom method that calls dataLayer.push(). We expect the
  // new message to be appended to the queue and processed last.
  dataLayer.push(
    {a: 'originalValue'},
    function() {
      dataLayer.push({a: 'newValue'});
    });
  ok(helper.get('a') === 'newValue');

  dataLayer.push(
    {numCustomMethodCalls: 0},
    function() {
      var method = function() {
        var numCalls = this.get('numCustomMethodCalls');
        if (numCalls < 10) {
          this.set('numCustomMethodCalls', numCalls + 1);
          dataLayer.push(method);
        }
      };
      dataLayer.push(method);
    })
  ok(helper.get('numCustomMethodCalls') === 10);
});
