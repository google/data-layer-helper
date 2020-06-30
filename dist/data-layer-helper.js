(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
function h(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function p(a){if(!a||"object"!=l(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||m(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
var q={};function t(a,b,c){this.c=a;this.i=b||function(){};this.f=!1;this.a={};this.b=[];this.h=u(this);v(this,a,!c);var d=a.push,e=this;a.push=function(){var f=[].slice.call(arguments,0),g=d.apply(a,f);v(e,f);return g}}window.DataLayerHelper=t;t.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};t.prototype.flatten=function(){this.c.splice(0,this.c.length);this.c[0]={};w(this.a,this.c[0])};
function v(a,b,c){for(a.b.push.apply(a.b,b);!1===a.f&&0<a.b.length;){b=a.b.shift();if("array"==l(b))a:{var d=a.a;if("string"==l(b[0])){for(var e=b[0].split("."),f=e.pop(),g=b.slice(1),n=0;n<e.length;n++){if(void 0===d[e[n]])break a;d=d[e[n]]}try{d[f].apply(d,g)}catch(y){}}}else if("arguments"==l(b)){e=[];f=a.j[b[0]];f=(g="undefined"!=typeof Symbol&&Symbol.iterator&&f[Symbol.iterator])?g.call(f):{next:h(f)};for(g=f.next();!g.done;g=f.next())e.push(g.value);v(q,e)}else if("function"==typeof b)try{b.call(a.h)}catch(y){}else if(p(b))for(var r in b)w(x(r,
b[r]),a.a);else continue;c||(a.f=!0,a.i(a.a,b),a.f=!1)}}function u(a){return{set:function(b,c){w(x(b,c),a.a)},get:function(b){return a.get(b)}}}t.prototype.registerProcessor=function(a,b){a in this.g||(this.g[a]=[]);this.g[a].push(b)};function x(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function w(a,b){for(var c in a)if(m(a,c)){var d=a[c];"array"==l(d)?("array"==l(b[c])||(b[c]=[]),w(d,b[c])):p(d)?(p(b[c])||(b[c]={}),w(d,b[c])):b[c]=d}};})();
