/**
 * Copyright 2014 Google Inc. All rights reserved.
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
 * @fileoverview Unit tests for processCommand_().
 * @author AlexanderRNau@gmail.com (Alex Nau)
 */

test('processCommand', function() {

  function assertCommand(command, startingModel, expectedModel) {
    helper.processCommand_(command, startingModel);
    deepEqual(startingModel, expectedModel);
  }

  // Test various array methods with single level keys.
  assertCommand(['a.push', 1], {a: [0]}, {a: [0, 1]});
  assertCommand(['a.push', [1]], {a: [0]}, {a: [0, [1]]});
  assertCommand(['a.push', {b: [1]}], {a: [0]}, {a: [0, {b: [1]}]});
  assertCommand(['a.push', 'cat'], {a: [0]}, {a: [0, 'cat']});
  assertCommand(['a.push', 1, 2], {a: [0]}, {a: [0, 1, 2]});
  assertCommand(['a.push', 1, 2, 3, 4], {a: [0]}, {a: [0, 1, 2, 3, 4]});
  assertCommand(['a.push', 1], {a: [0], b: [1]}, {a: [0, 1], b: [1]});
  assertCommand(['a.pop'], {a: [0]}, {a: []});
  assertCommand(['a.sort'], {a: [5, 4, 3, 2, 1]}, {a: [1, 2, 3, 4, 5]});
  assertCommand(
    ['a.sort', function(a, b) {return b - a;}],
    {a: [1, 2, 3, 4, 5]},
    {a: [5, 4, 3, 2, 1]});
  assertCommand(['a.reverse'], {a: [5, 4, 3, 2, 1]}, {a: [1, 2, 3, 4, 5]});
  assertCommand(['a.shift'], {a: [1, 2, 3]}, {a: [2, 3]});
  assertCommand(['a.unshift', 0], {a: [1, 2, 3]}, {a: [0, 1, 2, 3]});
  assertCommand(
    ['a.unshift', -3, -2, -1, 0],
    {a: [1, 2, 3]},
    {a: [-3, -2, -1, 0, 1, 2, 3]});
  assertCommand(['a.splice', 2, 1], {a: [1, 2, 3, 4, 5]}, {a: [1, 2, 4, 5]});
  assertCommand(
    ['a.splice', 1, Number.MAX_VALUE],
    {a: [1, 2, 3, 4, 5]},
    {a: [1]});
  assertCommand(
    ['a.splice', 2, 1, 'cat'],
    {a: [1, 2, 3, 4, 5]},
    {a: [1, 2, 'cat', 4, 5]});
  assertCommand(
    ['a.splice', 2, 1, 'cat', 'in', 'the', 'hat'],
    {a: [1, 2, 3, 4, 5]},
    {a: [1, 2, 'cat', 'in', 'the', 'hat', 4, 5]});

  // Test various methods with a Date object.
  var date = new Date();
  assertCommand(['date.setFullYear', 2000], {date: date}, {date: date});
  equal(2000, date.getFullYear());
  assertCommand(['date.setMonth', 11], {date: date}, {date: date});
  equal(11, date.getMonth());

  // Test various methods with a custom class.
  var mutableObject = {
    a: 1,
    b: 2
  };
  mutableObject.addItem = function(item, value) {
    this[item] = value;
  };  
  mutableObject.updateItem = function(item, value) {
    if (this[item] !== undefined) {
      this[item] = value;
    }  
  };
  assertCommand(['object.addItem', 'c', 3],
      {object: mutableObject}, {object: mutableObject});
  equal(mutableObject['c'], 3);
  assertCommand(['object.updateItem', 'a', 'cat'],
      {object: mutableObject}, {object: mutableObject});
  equal(mutableObject['a'], 'cat');

  // Test various array methods with multiple level keys.
  assertCommand(['a.b.push', 1], {a: {b: [0]}}, {a: {b: [0, 1]}});
  assertCommand(['a.b.push', 1, 2], {a: {b: [0]}}, {a: {b: [0, 1, 2]}});
  assertCommand(['a.b.push', 1, 2, 3, 4],
      {a: {b: [0]}}, {a: {b: [0, 1, 2, 3, 4]}});
  assertCommand(['a.b.c.push', ['one', 'two']],
      {a: {b: {c : [0]}}}, {a: {b: {c: [0, ['one', 'two']]}}});

  assertCommand(['a.c.push', 1],
      {a: {c: [0]}, b: [1]}, {a: {c: [0, 1]}, b: [1]});
  assertCommand(['a.b.pop'], {a: {b: [0]}}, {a: {b: []}});
  assertCommand(['a.b.sort'],
      {a: {b: [5, 4, 3, 2, 1]}}, {a: {b: [1, 2, 3, 4, 5]}});
  assertCommand(['a.b.sort', function(a, b) {return b - a;}],
      {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [5, 4, 3, 2, 1]}});
  assertCommand(['a.b.reverse'],
      {a: {b: [5, 4, 3, 2, 1]}}, {a: {b: [1, 2, 3, 4, 5]}});
  assertCommand(['a.b.shift'], {a: {b: [1, 2, 3]}}, {a: {b: [2, 3]}});
  assertCommand(['a.b.unshift', 0],
      {a: {b: [1, 2, 3]}}, {a: {b: [0, 1, 2, 3]}});
  assertCommand(['a.b.unshift', -3, -2, -1, 0],
      {a: {b: [1, 2, 3]}}, {a: {b: [-3, -2, -1, 0, 1, 2, 3]}});
  assertCommand(['a.b.splice', 2, 1],
      {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1, 2, 4, 5]}});
  assertCommand(['a.b.splice', 1, Number.MAX_VALUE],
      {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1]}});
  assertCommand(['a.b.splice', 2, 1, 'cat'],
      {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1, 2, 'cat', 4, 5]}});
  assertCommand(['a.b.splice', 2, 1, 'cat', 'in', 'the', 'hat'],
      {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1, 2, 'cat', 'in', 'the', 'hat', 4, 5]}});
});
