(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=l(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var d={},c=d;a=a.split(".");for(var e=0;e<a.length-1;e++)c=c[a[e]]={};c[a[a.length-1]]=b;return d}function q(a,b){var d=!a._clear,c;for(c in a)if(m(a,c)){var e=a[c];"array"===l(e)&&d?("array"===l(b[c])||(b[c]=[]),q(e,b[c])):n(e)&&d?(n(b[c])||(b[c]={}),q(e,b[c])):b[c]=e}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,d){this.c=a;this.i=void 0===b?function(){}:b;this.g=!1;this.a={};this.b=[];this.f={};this.h=u(this);v(this,a,!(void 0===d?0:d));var c=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),h=c.apply(a,g);v(e,g);return h}}r.prototype.get=function(a){var b=this.a;a=a.split(".");for(var d=0;d<a.length;d++){if(void 0===b[a[d]])return;b=b[a[d]]}return b};r.prototype.flatten=function(){this.c.splice(0,this.c.length);this.c[0]={};q(this.a,this.c[0])};
function v(a,b,d){d=void 0===d?!1:d;for(a.b.push.apply(a.b,b);!1===a.g&&0<a.b.length;){b=a.b.shift();if("array"===l(b))a:{var c=a.a;if("string"===l(b[0])){for(var e=b[0].split("."),g=e.pop(),h=b.slice(1),f=0;f<e.length;f++){if(void 0===c[e[f]])break a;c=c[e[f]]}try{c[g].apply(c,h)}catch(w){}}}else if("arguments"===l(b)){e=a;g=[];h=b[0];if(e.f[h])for(c=e.f[h].length,f=0;f<c;f++)g.push(e.f[h][f].apply(e.h,[].slice.call(b,1)));a.b.push.apply(a.b,g)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.a);else continue;d||(a.g=!0,a.i(a.a,b),a.g=!1)}}window.DataLayerHelper=r;function u(a){return{set:function(b,d){q(p(b,d),a.a)},get:function(b){return a.get(b)}}};})();
