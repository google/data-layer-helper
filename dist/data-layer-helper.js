(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';function g(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}function h(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:g(a)}}function k(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c};/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var l=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function n(a){return null==a?String(a):(a=l.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function q(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function t(a){if(!a||"object"!=n(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!q(a,"constructor")&&!q(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||q(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function u(a,b,c){this.c=a;this.i=void 0===b?function(){}:b;this.g=!1;this.a={};this.b=[];this.f={};this.h=v(this);w(this,a,!(void 0===c?0:c));var d=a.push,e=this;a.push=function(){var f=[].slice.call(arguments,0),p=d.apply(a,f);w(e,f);return p}}u.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};u.prototype.flatten=function(){this.c.splice(0,this.c.length);this.c[0]={};x(this.a,this.c[0])};
u.prototype.j=function(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];d=[];if(this.f[a])for(var e=this.f[a].length,f=0;f<e;f++)d.push(this.f[a][f].apply(this.h,c));return d};
function w(a,b,c){c=void 0===c?!1:c;for(a.b.push.apply(a.b,b);!1===a.g&&0<a.b.length;){b=a.b.shift();if("array"===n(b))a:{var d=a.a;if("string"===n(b[0])){for(var e=b[0].split("."),f=e.pop(),p=b.slice(1),m=0;m<e.length;m++){if(void 0===d[e[m]])break a;d=d[e[m]]}try{d[f].apply(d,p)}catch(z){}}}else if("arguments"===n(b))e=a.j.apply(a,b instanceof Array?b:k(h(b))),a.b.push.apply(a.b,e);else if("function"==typeof b)try{b.call(a.h)}catch(z){}else if(t(b))for(var r in b)x(y(r,b[r]),a.a);else continue;
c||(a.g=!0,a.i(a.a,b),a.g=!1)}}window.DataLayerHelper=u;function v(a){return{set:function(b,c){x(y(b,c),a.a)},get:function(b){return a.get(b)}}}function y(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function x(a,b){for(var c in a)if(q(a,c)){var d=a[c];"array"===n(d)?("array"===n(b[c])||(b[c]=[]),x(d,b[c])):t(d)?(t(b[c])||(b[c]={}),x(d,b[c])):b[c]=d}};})();
