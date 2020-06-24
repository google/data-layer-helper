(function(){/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
goog.provide("plain");plain.TYPE_RE_=/\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/;plain.type=function(value){if(value==null)return String(value);var match=plain.TYPE_RE_.exec(Object.prototype.toString.call(Object(value)));if(match)return match[1].toLowerCase();return"object"};plain.hasOwn=function(value,key){return Object.prototype.hasOwnProperty.call(Object(value),key)};
plain.isPlainObject=function(value){if(!value||plain.type(value)!="object"||value.nodeType||value==value.window)return false;try{if(value.constructor&&!plain.hasOwn(value,"constructor")&&!plain.hasOwn(value.constructor.prototype,"isPrototypeOf"))return false}catch(e){return false}var key;for(key in value);return key===undefined||plain.hasOwn(value,key)};})();
