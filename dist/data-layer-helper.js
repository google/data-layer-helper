(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(b){return null==b?String(b):(b=f.exec(Object.prototype.toString.call(Object(b))))?b[1].toLowerCase():"object"}function k(b,a){return Object.prototype.hasOwnProperty.call(Object(b),a)}function m(b){if(!b||"object"!=g(b)||b.nodeType||b==b.window)return!1;try{if(b.constructor&&!k(b,"constructor")&&!k(b.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var a in b);return void 0===a||k(b,a)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function p(b,a,c){a=void 0===a?{}:a;"function"===typeof a?a={listener:a,j:void 0===c?!1:c,l:!0,h:{}}:a={listener:void 0===a.listener?function(){}:a.listener,j:void 0===a.listenToPast?!1:a.listenToPast,l:void 0===a.processNow?!0:a.processNow,h:void 0===a.commandProcessors?{}:a.commandProcessors};this.a=b;this.o=a.listener;this.m=a.j;this.g=!1;this.c={};this.f=[];this.b=a.h;this.i=q(this);a.l&&this.process()}
p.prototype.process=function(){r(this,this.a,!this.m);this.registerProcessor("set",function(){if(1===arguments.length&&"object"===g(arguments[0]))u(arguments[0],this);else if(2===arguments.length&&"string"===g(arguments[0])){var c=v(arguments[0],arguments[1]);u(c,this)}});var b=this.a.push,a=this;this.a.push=function(){var c=[].slice.call(arguments,0),d=b.apply(a.a,c);r(a,c);return d}};
p.prototype.get=function(b){var a=this.c;b=b.split(".");for(var c=0;c<b.length;c++){if(void 0===a[b[c]])return;a=a[b[c]]}return a};p.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};u(this.c,this.a[0])};p.prototype.registerProcessor=function(b,a){b in this.b||(this.b[b]=[]);this.b[b].push(a)};
function r(b,a,c){c=void 0===c?!1:c;for(b.f.push.apply(b.f,a);!1===b.g&&0<b.f.length;){a=b.f.shift();if("array"===g(a))a:{var d=b.c;g(a[0]);for(var e=a[0].split("."),n=e.pop(),l=a.slice(1),h=0;h<e.length;h++){if(void 0===d[e[h]])break a;d=d[e[h]]}try{d[n].apply(d,l)}catch(w){}}else if("arguments"===g(a)){e=b;n=[];l=a[0];if(e.b[l])for(d=e.b[l].length,h=0;h<d;h++)n.push(e.b[l][h].apply(e.i,[].slice.call(a,1)));b.f.push.apply(b.f,n)}else if("function"==typeof a)try{a.call(b.i)}catch(w){}else if(m(a))for(var t in a)u(v(t,
a[t]),b.c);else continue;c||(b.g=!0,b.o(b.c,a),b.g=!1)}}p.prototype.registerProcessor=p.prototype.registerProcessor;p.prototype.flatten=p.prototype.flatten;p.prototype.get=p.prototype.get;p.prototype.process=p.prototype.process;window.DataLayerHelper=p;function q(b){return{set:function(a,c){u(v(a,c),b.c)},get:function(a){return b.get(a)}}}function v(b,a){var c={},d=c;b=b.split(".");for(var e=0;e<b.length-1;e++)d=d[b[e]]={};d[b[b.length-1]]=a;return c}
function u(b,a){var c=!b._clear,d;for(d in b)if(k(b,d)){var e=b[d];"array"===g(e)&&c?("array"===g(a[d])||(a[d]=[]),u(e,a[d])):m(e)&&c?(m(a[d])||(a[d]={}),u(e,a[d])):a[d]=e}delete a._clear};})();
