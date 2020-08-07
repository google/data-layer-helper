(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function k(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function m(a){if(!a||"object"!=g(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!k(a,"constructor")&&!k(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||k(a,b)};function p(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function q(a,b){var c=!a._clear,d;for(d in a)if(k(a,d)){var e=a[d];"array"===g(e)&&c?("array"===g(b[d])||(b[d]=[]),q(e,b[d])):m(e)&&c?(m(b[d])||(b[d]={}),q(e,b[d])):b[d]=e}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,c){b=void 0===b?{}:b;"function"===typeof b?b={listener:b,listenToPast:void 0===c?!1:c,processNow:!0,commandProcessors:{}}:b={listener:b.listener||function(){},listenToPast:b.listenToPast||!1,processNow:void 0===b.processNow?!0:b.processNow,commandProcessors:b.commandProcessors||{}};this.a=a;this.j=b.listener;this.i=b.listenToPast;this.g=!1;this.c={};this.f=[];this.b=b.commandProcessors;this.h=u(this);b.processNow&&this.process()}
r.prototype.process=function(){v(this,this.a,!this.i);this.registerProcessor("set",function(){if(1===arguments.length&&"object"===g(arguments[0]))q(arguments[0],this);else if(2===arguments.length&&"string"===g(arguments[0])){var c=p(arguments[0],arguments[1]);q(c,this)}});var a=this.a.push,b=this;this.a.push=function(){var c=[].slice.call(arguments,0),d=a.apply(b.a,c);v(b,c);return d}};
r.prototype.get=function(a){var b=this.c;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};r.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};q(this.c,this.a[0])};r.prototype.registerProcessor=function(a,b){a in this.b||(this.b[a]=[]);this.b[a].push(b)};
function v(a,b,c){c=void 0===c?!1:c;for(a.f.push.apply(a.f,b);!1===a.g&&0<a.f.length;){b=a.f.shift();if("array"===g(b))a:{var d=a.c;g(b[0]);for(var e=b[0].split("."),n=e.pop(),l=b.slice(1),h=0;h<e.length;h++){if(void 0===d[e[h]])break a;d=d[e[h]]}try{d[n].apply(d,l)}catch(w){}}else if("arguments"===g(b)){e=a;n=[];l=b[0];if(e.b[l])for(d=e.b[l].length,h=0;h<d;h++)n.push(e.b[l][h].apply(e.h,[].slice.call(b,1)));a.f.push.apply(a.f,n)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(m(b))for(var t in b)q(p(t,
b[t]),a.c);else continue;c||(a.g=!0,a.j(a.c,b),a.g=!1)}}r.prototype.registerProcessor=r.prototype.registerProcessor;r.prototype.flatten=r.prototype.flatten;r.prototype.get=r.prototype.get;r.prototype.process=r.prototype.process;window.DataLayerHelper=r;function u(a){return{set:function(b,c){q(p(b,c),a.c)},get:function(b){return a.get(b)}}};})();
