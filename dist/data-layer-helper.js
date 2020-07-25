(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=g(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(var b in a);return void 0===b||m(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function p(a,b,d){var c=void 0===b?{}:b,e=void 0===c.listener?function(){}:c.listener,k=void 0===c.listenToPast?!1:c.listenToPast,l=void 0===c.processNow?!0:c.processNow;c=void 0===c.commandProcessors?{}:c.commandProcessors;"function"===typeof b&&(e=b,k=d||!1);this.a=a;this.m=e;this.l=k;this.g=!1;this.c={};this.f=[];this.b=c;this.h=q(this);l&&this.i()}
p.prototype.i=function(){r(this,this.a,!this.l);this.j("set",function(){if(1===arguments.length&&"object"===g(arguments[0]))u(arguments[0],this);else if(2===arguments.length&&"string"===g(arguments[0])){var d=v(arguments[0],arguments[1]);u(d,this)}});var a=this.a.push,b=this;this.a.push=function(){var d=[].slice.call(arguments,0),c=a.apply(b.a,d);r(b,d);return c}};p.prototype.get=function(a){var b=this.c;a=a.split(".");for(var d=0;d<a.length;d++){if(void 0===b[a[d]])return;b=b[a[d]]}return b};
p.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};u(this.c,this.a[0])};p.prototype.j=function(a,b){a in this.b||(this.b[a]=[]);this.b[a].push(b)};
function r(a,b,d){d=void 0===d?!1:d;for(a.f.push.apply(a.f,b);!1===a.g&&0<a.f.length;){b=a.f.shift();if("array"===g(b))a:{var c=a.c;g(b[0]);for(var e=b[0].split("."),k=e.pop(),l=b.slice(1),h=0;h<e.length;h++){if(void 0===c[e[h]])break a;c=c[e[h]]}try{c[k].apply(c,l)}catch(w){}}else if("arguments"===g(b)){e=a;k=[];l=b[0];if(e.b[l])for(c=e.b[l].length,h=0;h<c;h++)k.push(e.b[l][h].apply(e.h,[].slice.call(b,1)));a.f.push.apply(a.f,k)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)u(v(t,
b[t]),a.c);else continue;d||(a.g=!0,a.m(a.c,b),a.g=!1)}}window.DataLayerHelper=p;p.prototype.process=p.prototype.i;p.prototype.registerProcessor=p.prototype.j;function q(a){return{set:function(b,d){u(v(b,d),a.c)},get:function(b){return a.get(b)}}}function v(a,b){var d={},c=d;a=a.split(".");for(var e=0;e<a.length-1;e++)c=c[a[e]]={};c[a[a.length-1]]=b;return d}
function u(a,b){var d=!a._clear,c;for(c in a)if(m(a,c)){var e=a[c];"array"===g(e)&&d?("array"===g(b[c])||(b[c]=[]),u(e,b[c])):n(e)&&d?(n(b[c])||(b[c]={}),u(e,b[c])):b[c]=e}delete b._clear};})();
