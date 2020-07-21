(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=l(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(var b in a);return void 0===b||m(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function p(a,b,d){this.f=a;this.i=void 0===b?function(){}:b;this.g=!1;this.b={};this.c=[];this.a={};this.h=q(this);t(this,a,!(void 0===d?0:d));var c=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),h=c.apply(a,g);t(e,g);return h}}p.prototype.get=function(a){var b=this.b;a=a.split(".");for(var d=0;d<a.length;d++){if(void 0===b[a[d]])return;b=b[a[d]]}return b};p.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};u(this.b,this.f[0])};
p.prototype.j=function(a,b){a in this.a||(this.a[a]=[]);this.a[a].push(b)};
function t(a,b,d){d=void 0===d?!1:d;for(a.c.push.apply(a.c,b);!1===a.g&&0<a.c.length;){b=a.c.shift();if("array"===l(b))a:{var c=a.b;if("string"===l(b[0])){for(var e=b[0].split("."),g=e.pop(),h=b.slice(1),f=0;f<e.length;f++){if(void 0===c[e[f]])break a;c=c[e[f]]}try{c[g].apply(c,h)}catch(w){}}}else if("arguments"===l(b)){e=a;g=[];h=b[0];if(e.a[h])for(c=e.a[h].length,f=0;f<c;f++)g.push(e.a[h][f].apply(e.h,[].slice.call(b,1)));a.c.push.apply(a.c,g)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var r in b)u(v(r,
b[r]),a.b);else continue;d||(a.g=!0,a.i(a.b,b),a.g=!1)}}window.DataLayerHelper=p;function q(a){return{set:function(b,d){u(v(b,d),a.b)},get:function(b){return a.get(b)}}}function v(a,b){var d={},c=d;a=a.split(".");for(var e=0;e<a.length-1;e++)c=c[a[e]]={};c[a[a.length-1]]=b;return d}function u(a,b){var d=!a._clear,c;for(c in a)if(m(a,c)){var e=a[c];"array"===l(e)&&d?("array"===l(b[c])||(b[c]=[]),u(e,b[c])):n(e)&&d?(n(b[c])||(b[c]={}),u(e,b[c])):b[c]=e}delete b._clear}
p.prototype.registerProcessor=p.prototype.j;})();
