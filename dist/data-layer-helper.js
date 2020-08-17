(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=g(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(e){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var e={},c=e;a=a.split(".");for(var d=0;d<a.length-1;d++)c=c[a[d]]={};c[a[a.length-1]]=b;return e}function q(a,b){var e=!a._clear,c;for(c in a)if(m(a,c)){var d=a[c];"array"===g(d)&&e?("array"===g(b[c])||(b[c]=[]),q(d,b[c])):n(d)&&e?(n(b[c])||(b[c]={}),q(d,b[c])):b[c]=d}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,e){b=void 0===b?{}:b;"function"===typeof b?b={listener:b,listenToPast:void 0===e?!1:e,processNow:!0,commandProcessors:{}}:b={listener:b.listener||function(){},listenToPast:b.listenToPast||!1,processNow:void 0===b.processNow?!0:b.processNow,commandProcessors:b.commandProcessors||{}};this.a=a;this.l=b.listener;this.j=b.listenToPast;this.g=this.i=!1;this.c={};this.f=[];this.b=b.commandProcessors;this.h=u(this);var c=this.a.push,d=this;this.a.push=function(){var k=[].slice.call(arguments,
0),l=c.apply(d.a,k);v(d,k);return l};b.processNow&&this.process()}r.prototype.process=function(){this.registerProcessor("set",function(){var b={};1===arguments.length&&"object"===g(arguments[0])?b=arguments[0]:2===arguments.length&&"string"===g(arguments[0])&&(b=p(arguments[0],arguments[1]));return b});this.i=!0;for(var a=0;a<this.m.length;a++)v(this,this.a[a],!this.j)};r.prototype.get=function(a){var b=this.c;a=a.split(".");for(var e=0;e<a.length;e++){if(void 0===b[a[e]])return;b=b[a[e]]}return b};
r.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};q(this.c,this.a[0])};r.prototype.registerProcessor=function(a,b){a in this.b||(this.b[a]=[]);this.b[a].push(b)};
function v(a,b,e){e=void 0===e?!1:e;if(a.i&&(a.f.push.apply(a.f,b),!a.g))for(;0<a.f.length;){b=a.f.shift();if("array"===g(b))a:{var c=a.c;g(b[0]);for(var d=b[0].split("."),k=d.pop(),l=b.slice(1),h=0;h<d.length;h++){if(void 0===c[d[h]])break a;c=c[d[h]]}try{c[k].apply(c,l)}catch(w){}}else if("arguments"===g(b)){d=a;k=[];l=b[0];if(d.b[l])for(c=d.b[l].length,h=0;h<c;h++)k.push(d.b[l][h].apply(d.h,[].slice.call(b,1)));a.f.push.apply(a.f,k)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.c);else continue;e||(a.g=!0,a.l(a.c,b),a.g=!1)}}r.prototype.registerProcessor=r.prototype.registerProcessor;r.prototype.flatten=r.prototype.flatten;r.prototype.get=r.prototype.get;r.prototype.process=r.prototype.process;window.DataLayerHelper=r;function u(a){return{set:function(b,e){q(p(b,e),a.c)},get:function(b){return a.get(b)}}};})();
