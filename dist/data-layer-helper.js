(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var g=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function k(a){return null==a?String(a):(a=g.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=k(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var d={},c=d;a=a.split(".");for(var e=0;e<a.length-1;e++)c=c[a[e]]={};c[a[a.length-1]]=b;return d}function q(a,b){var d=!a._clear,c;for(c in a)if(m(a,c)){var e=a[c];"array"===k(e)&&d?("array"===k(b[c])||(b[c]=[]),q(e,b[c])):n(e)&&d?(n(b[c])||(b[c]={}),q(e,b[c])):b[c]=e}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,d){this.f=a;this.i=void 0===b?function(){}:b;this.g=!1;this.b={};this.c=[];this.a={};this.h=u(this);v(this,a,!(void 0===d?0:d));w(this,function(){if(1===arguments.length&&"object"===k(arguments[0]))q(arguments[0],this);else if(2===arguments.length&&"string"===k(arguments[0])){var f=p(arguments[0],arguments[1]);q(f,this)}});var c=a.push,e=this;a.push=function(){var f=[].slice.call(arguments,0),l=c.apply(a,f);v(e,f);return l}}
r.prototype.get=function(a){var b=this.b;a=a.split(".");for(var d=0;d<a.length;d++){if(void 0===b[a[d]])return;b=b[a[d]]}return b};r.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};q(this.b,this.f[0])};function w(a,b){"set"in a.a||(a.a.set=[]);a.a.set.push(b)}
function v(a,b,d){d=void 0===d?!1:d;for(a.c.push.apply(a.c,b);!1===a.g&&0<a.c.length;){b=a.c.shift();if("array"===k(b))a:{var c=a.b;k(b[0]);for(var e=b[0].split("."),f=e.pop(),l=b.slice(1),h=0;h<e.length;h++){if(void 0===c[e[h]])break a;c=c[e[h]]}try{c[f].apply(c,l)}catch(x){}}else if("arguments"===k(b)){e=a;f=[];l=b[0];if(e.a[l])for(c=e.a[l].length,h=0;h<c;h++)f.push(e.a[l][h].apply(e.h,[].slice.call(b,1)));a.c.push.apply(a.c,f)}else if("function"==typeof b)try{b.call(a.h)}catch(x){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.b);else continue;d||(a.g=!0,a.i(a.b,b),a.g=!1)}}window.DataLayerHelper=r;function u(a){return{set:function(b,d){q(p(b,d),a.b)},get:function(b){return a.get(b)}}};})();
