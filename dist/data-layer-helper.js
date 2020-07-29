(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function h(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function l(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=h(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!l(a,"constructor")&&!l(a.constructor.prototype,"isPrototypeOf"))return!1}catch(d){return!1}for(var b in a);return void 0===b||l(a,b)};function p(a,b){var d={},c=d;a=a.split(".");for(var e=0;e<a.length-1;e++)c=c[a[e]]={};c[a[a.length-1]]=b;return d}function q(a,b){var d=!a._clear,c;for(c in a)if(l(a,c)){var e=a[c];"array"===h(e)&&d?("array"===h(b[c])||(b[c]=[]),q(e,b[c])):n(e)&&d?(n(b[c])||(b[c]={}),q(e,b[c])):b[c]=e}delete b._clear};/*
 Copyright 2012 Google Inc. All rights reserved. */
function r(a,b,d){this.f=a;this.j=void 0===b?function(){}:b;this.g=!1;this.b={};this.c=[];this.a={};this.h=u(this);v(this,a,!(void 0===d?0:d));this.i("set",function(){if(1===arguments.length&&"object"===h(arguments[0]))q(arguments[0],this);else if(2===arguments.length&&"string"===h(arguments[0])){var g=p(arguments[0],arguments[1]);q(g,this)}});var c=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),m=c.apply(a,g);v(e,g);return m}}
r.prototype.get=function(a){var b=this.b;a=a.split(".");for(var d=0;d<a.length;d++){if(void 0===b[a[d]])return;b=b[a[d]]}return b};r.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};q(this.b,this.f[0])};r.prototype.i=function(a,b){a in this.a||(this.a[a]=[]);this.a[a].push(b)};
function v(a,b,d){d=void 0===d?!1:d;for(a.c.push.apply(a.c,b);!1===a.g&&0<a.c.length;){b=a.c.shift();if("array"===h(b))a:{var c=a.b;h(b[0]);for(var e=b[0].split("."),g=e.pop(),m=b.slice(1),k=0;k<e.length;k++){if(void 0===c[e[k]])break a;c=c[e[k]]}try{c[g].apply(c,m)}catch(w){}}else if("arguments"===h(b)){e=a;g=[];m=b[0];if(e.a[m])for(c=e.a[m].length,k=0;k<c;k++)g.push(e.a[m][k].apply(e.h,[].slice.call(b,1)));a.c.push.apply(a.c,g)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var t in b)q(p(t,
b[t]),a.b);else continue;d||(a.g=!0,a.j(a.b,b),a.g=!1)}}window.DataLayerHelper=r;r.prototype.get=r.prototype.get;r.prototype.flatten=r.prototype.flatten;r.prototype.registerProcessor=r.prototype.i;function u(a){return{set:function(b,d){q(p(b,d),a.b)},get:function(b){return a.get(b)}}};})();
