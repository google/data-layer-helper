(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=g(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function q(a,b){var c=!a._clear,d;for(d in a)if(m(a,d)){var e=a[d];"array"===g(e)&&c?("array"===g(b[d])||(b[d]=[]),q(e,b[d])):n(e)&&c?(n(b[d])||(b[d]={}),q(e,b[d])):b[d]=e}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,c){b=void 0===b?{}:b;"function"===typeof b?b={listener:b,listenToPast:void 0===c?!1:c,processNow:!0,commandProcessors:{}}:b={listener:b.listener||function(){},listenToPast:b.listenToPast||!1,processNow:void 0===b.processNow?!0:b.processNow,commandProcessors:b.commandProcessors||{}};this.a=a;this.l=b.listener;this.j=b.listenToPast;this.g=this.i=!1;this.c={};this.f=[];this.b=b.commandProcessors;this.h=u(this);var d=this.a.push,e=this;this.a.push=function(){var k=[].slice.call(arguments,
0),l=d.apply(e.a,k);v(e,k);return l};b.processNow&&this.process()}r.prototype.process=function(){this.registerProcessor("set",function(){var c={};1===arguments.length&&"object"===g(arguments[0])?c=arguments[0]:2===arguments.length&&"string"===g(arguments[0])&&(c=p(arguments[0],arguments[1]));return c});this.i=!0;for(var a=this.a.length,b=0;b<a;b++)v(this,[this.a[b]],!this.j)};r.prototype.get=function(a){var b=this.c;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};
r.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};q(this.c,this.a[0])};r.prototype.registerProcessor=function(a,b){a in this.b||(this.b[a]=[]);this.b[a].push(b)};
function v(a,b,c){c=void 0===c?!1:c;if(a.i&&(a.f.push.apply(a.f,b),!a.g))for(;0<a.f.length;){b=a.f.shift();if("array"===g(b))a:{var d=a.c;g(b[0]);for(var e=b[0].split("."),k=e.pop(),l=b.slice(1),h=0;h<e.length;h++){if(void 0===d[e[h]])break a;d=d[e[h]]}try{d[k].apply(d,l)}catch(w){}}else if("arguments"===g(b)){e=a;k=[];l=b[0];if(e.b[l])for(d=e.b[l].length,h=0;h<d;h++)k.push(e.b[l][h].apply(e.h,[].slice.call(b,1)));a.f.push.apply(a.f,k)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.c);else continue;c||(a.g=!0,a.l(a.c,b),a.g=!1)}}r.prototype.registerProcessor=r.prototype.registerProcessor;r.prototype.flatten=r.prototype.flatten;r.prototype.get=r.prototype.get;r.prototype.process=r.prototype.process;window.DataLayerHelper=r;function u(a){return{set:function(b,c){q(p(b,c),a.c)},get:function(b){return a.get(b)}}};})();
