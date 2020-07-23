goog.module('datalayerhelper.helper.utils.testing.processCommand');
goog.setTestOnly();

const {processCommand} = goog.require('datalayerhelper.helper.utils');

describe('The `processCommand` function of helper', () => {
  /**
   * A helper method to assert that a command passed to the processCommand
   * method produces the desired result.
   * @param {!Array<Object>} command A list of arguments to be given to the
   *     processCommandfunction of helper, representing the command to
   *     run on the model.
   * @param {!Object} startingModel The starting state of the model.
   * @param {!Object} expectedModel The expected state of the model after
   *     processing the command.
   */
  function assertCommand(command, startingModel, expectedModel) {
    processCommand(command, startingModel);

    expect(startingModel).toEqual(expectedModel);
  }

  describe('The behavior with built in array commands', () => {
    describe('functionality with single level keys', () => {
      it('works with the push command', () => {
        assertCommand(/* command= */ ['a.push', 1],
            /* startigModel= */ {a: [0]}, /* expectedModel= */ {a: [0, 1]});
        assertCommand(['a.push', [1]], {a: [0]}, {a: [0, [1]]});
        assertCommand(['a.push', {b: [1]}], {a: [0]}, {a: [0, {b: [1]}]});
        assertCommand(['a.push', 'cat'], {a: [0]}, {a: [0, 'cat']});
        assertCommand(['a.push', 1, 2], {a: [0]}, {a: [0, 1, 2]});
        assertCommand(['a.push', 1, 2, 3, 4], {a: [0]}, {a: [0, 1, 2, 3, 4]});
        assertCommand(['a.push', 1], {a: [0], b: [1]}, {a: [0, 1], b: [1]});
      });

      it('works with the splice command', () => {
        assertCommand(['a.splice', 2, 1], {a: [1, 2, 3, 4, 5]},
            {a: [1, 2, 4, 5]});
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
      });

      it('works with various array helper commands', () => {
        assertCommand(['a.pop'], {a: [0]}, {a: []});
        assertCommand(['a.sort'], {a: [5, 4, 3, 2, 1]}, {a: [1, 2, 3, 4, 5]});
        assertCommand(
            ['a.sort', (a, b) => b - a],
            {a: [1, 2, 3, 4, 5]},
            {a: [5, 4, 3, 2, 1]});
        assertCommand(['a.reverse'], {a: [5, 4, 3, 2, 1]},
            {a: [1, 2, 3, 4, 5]});
        assertCommand(['a.shift'], {a: [1, 2, 3]}, {a: [2, 3]});
        assertCommand(['a.unshift', 0], {a: [1, 2, 3]}, {a: [0, 1, 2, 3]});
        assertCommand(
            ['a.unshift', -3, -2, -1, 0],
            {a: [1, 2, 3]},
            {a: [-3, -2, -1, 0, 1, 2, 3]});
      });
    });

    describe('functionality with multiple level keys', () => {
      it('supports running the push command on nested arrays', () => {
        assertCommand(['a.b.push', 1], {a: {b: [0]}}, {a: {b: [0, 1]}});
        assertCommand(['a.b.push', 1, 2], {a: {b: [0]}}, {a: {b: [0, 1, 2]}});
        assertCommand(['a.b.push', 1, 2, 3, 4],
            {a: {b: [0]}}, {a: {b: [0, 1, 2, 3, 4]}});
        assertCommand(['a.b.c.push', ['one', 'two']],
            {a: {b: {c: [0]}}}, {a: {b: {c: [0, ['one', 'two']]}}});
        assertCommand(['a.c.push', 1],
            {a: {c: [0]}, b: [1]}, {a: {c: [0, 1]}, b: [1]});
      });

      it('supports running the splice command on nested arrays', () => {
        assertCommand(['a.b.splice', 2, 1],
            {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1, 2, 4, 5]}});
        assertCommand(['a.b.splice', 1, Number.MAX_VALUE],
            {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1]}});
        assertCommand(['a.b.splice', 2, 1, 'cat'],
            {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [1, 2, 'cat', 4, 5]}});
        assertCommand(['a.b.splice', 2, 1, 'cat', 'in', 'the', 'hat'],
            {a: {b: [1, 2, 3, 4, 5]}},
            {a: {b: [1, 2, 'cat', 'in', 'the', 'hat', 4, 5]}});
      });

      it('supports various other array helper commands on nested arrays',
          () => {
            assertCommand(['a.b.pop'], {a: {b: [0]}}, {a: {b: []}});
            assertCommand(['a.b.sort'],
                {a: {b: [5, 4, 3, 2, 1]}}, {a: {b: [1, 2, 3, 4, 5]}});
            assertCommand(['a.b.sort', function(a, b) {
              return b - a;
            }],
            {a: {b: [1, 2, 3, 4, 5]}}, {a: {b: [5, 4, 3, 2, 1]}});
            assertCommand(['a.b.reverse'],
                {a: {b: [5, 4, 3, 2, 1]}}, {a: {b: [1, 2, 3, 4, 5]}});
            assertCommand(['a.b.shift'], {a: {b: [1, 2, 3]}}, {a: {b: [2, 3]}});
            assertCommand(['a.b.unshift', 0],
                {a: {b: [1, 2, 3]}}, {a: {b: [0, 1, 2, 3]}});
            assertCommand(['a.b.unshift', -3, -2, -1, 0],
                {a: {b: [1, 2, 3]}}, {a: {b: [-3, -2, -1, 0, 1, 2, 3]}});
          });
    });
  });

  it('supports methods on the Date object', () => {
    const date = new Date();
    assertCommand(['date.setFullYear', 2000], {date: date}, {date: date});

    expect(2000).toBe(date.getFullYear());
    assertCommand(['date.setMonth', 11], {date: date}, {date: date});

    expect(11).toBe(date.getMonth());
  });

  it('supports objects that have been given custom methods', () => {
    const mutableObject = {a: 1, b: 2};
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

    expect(mutableObject['c']).toBe(3);
    assertCommand(['object.updateItem', 'a', 'cat'],
        {object: mutableObject}, {object: mutableObject});

    expect(mutableObject['a']).toBe('cat');
  });
});
