(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}
function n(a){if(!a||"object"!==l(a)||a.nodeType||a===a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function q(a,b){for(var c in a)if(m(a,c)){var d=a[c];"array"===l(d)?("array"===l(b[c])||(b[c]=[]),q(d,b[c])):n(d)?(n(b[c])||(b[c]={}),q(d,b[c])):b[c]=d}};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,c){this.f=a;this.i=void 0===b?function(){}:b;this.g=!1;this.b={};this.c=[];this.a={};this.h=u(this);v(this,a,!(void 0===c?0:c));var d=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),h=d.apply(a,g);v(e,g);return h}}r.prototype.get=function(a){var b=this.b;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};r.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};q(this.b,this.f[0])};
r.prototype.j=function(a,b){a in this.a||(this.a[a]=[]);this.a[a].push(b)};
function v(a,b,c){c=void 0===c?!1:c;for(a.c.push.apply(a.c,b);!1===a.g&&0<a.c.length;){b=a.c.shift();if("array"===l(b))a:{var d=a.b;if("string"===l(b[0])){for(var e=b[0].split("."),g=e.pop(),h=b.slice(1),f=0;f<e.length;f++){if(void 0===d[e[f]])break a;d=d[e[f]]}try{d[g].apply(d,h)}catch(w){}}}else if("arguments"===l(b)){e=a;g=[];h=b[0];if(e.a[h])for(d=e.a[h].length,f=0;f<d;f++)g.push(e.a[h][f].apply(e.h,[].slice.call(b,1)));a.c.push.apply(a.c,g)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.b);else continue;c||(a.g=!0,a.i(a.b,b),a.g=!1)}}window.DataLayerHelper=r;function u(a){return{set:function(b,c){q(p(b,c),a.b)},get:function(b){return a.get(b)}}}r.prototype.registerProcessor=r.prototype.j;})();
