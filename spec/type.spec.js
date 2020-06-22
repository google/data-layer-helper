goog.require('plain');

describe('the plain.type function', function() {

  function assertType(value, expected) {
    expect(plain.type(value)).toBe(expected);
  }

  describe('null and undefined values', function() {
    it('correctly identifies null', function() {
      assertType(null,'null');
    });

    it('correctly identifies undefined', function() {
      assertType(undefined, 'undefined');
    });
  });

  describe('boolean values', function() {
    it('identifies true as a boolean', function() {
      assertType(true, 'boolean');
    });

    it('identifies false as a boolean', function() {
      assertType(false, 'boolean');
    });
  });

  describe('numeric values', function() {
    it('identifies 0 as a number', function() {
      assertType(0, 'number');
    });

    it('identifies positive integers as numbers', function() {
      assertType(43, 'number');
    });

    it('identifies negative integers as numbers', function() {
      assertType(-43, 'number');
    });

    it('identifies small decimals as numbers', function() {
      assertType(0.000001,'number');
    });

    it('identifies floating points as numbers', function() {
      assertType(90001.5,'number');
    });

    it('identifies NaN as numbers', function() {
      assertType(NaN, 'number');
    });

    it('identifies infinity as a number', function() {
      assertType(Infinity, 'number');
    });
  });

  describe('string identification behavior', function() {
    it('identifies the empty string is a string', function() {
      assertType('', 'string');
    });

    it('identifies strings independently of content', function() {
      assertType('number', 'string');
    });
  });

  describe('function identification behavior', function() {
    it('identifies function variables as functions', function() {
      assertType(assertType, 'function');
    });

    it('identifies functions made with function syntax', function() {
      assertType(function(){}, 'function');
    });

    it('identifies functions made with arrow notation syntax', function() {
      assertType(()=>{}, 'function');
    });
  });

  describe('array identification behavior', function() {
    it('identifies an empty array as an array', function() {
      assertType([], 'array');
    });

    it('identifies a nonempty array as an array', function() {
      assertType(['number'], 'array');
    });

    it('identifies an empty array made with the Array constructor', function() {
      assertType(Array(), 'array');
    });

    it('identifies nonempty array made with the Array constructor', function() {
      assertType(Array('string'), 'array');
    });

    it('identifies array made with the object constructor', function() {
      assertType(Object([]), 'array');
    });

    it('identifies array made with the object and array constructor', function() {
      assertType(Object(Array()), 'array');
    });
  });

  describe('Date behavior', function() {
    it('identifies dates created without new as strings', function() {
      assertType(Date(), 'string');
    });

    it('identifies dates created with new as dates', function() {
      assertType(new Date(), 'date');
    });
  });

  describe('regex behavior', function() {
    it('identifies regex created with / / syntax', function() {
      assertType(/./, 'regexp');
    });

    it('identifies regex created with constructor syntax', function() {
      assertType(RegExp(), 'regexp');
    });
  });

  describe('object behavior', function() {
    it('identifies dictionaries as object', function() {
      assertType({a: 1}, 'object');
    });

    it('identifies things made by the object constructor as objects', function() {
      assertType(Object(), 'object');
    });

    it('identifies the window type as an object', function() {
      assertType(window, 'object');
    });

    it('identifies the document type as an object', function() {
      assertType(document, 'object');
    });

    it('identifies other complex types as an object', function() {
      assertType(document.getElementsByTagName('script')[0], 'object');
    });
  });
});
