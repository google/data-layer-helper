(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function g(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function h(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function m(a){if(!a||"object"!=g(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!h(a,"constructor")&&!h(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||h(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function n(a,b,c){this.b=a;this.h=void 0===b?function(){}:b;this.f=!1;this.a={};this.c=[];this.g=q(this);t(this,a,!(void 0===c?0:c));var d=a.push,e=this;a.push=function(){var k=[].slice.call(arguments,0),p=d.apply(a,k);t(e,k);return p}}n.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};n.prototype.flatten=function(){this.b.splice(0,this.b.length);this.b[0]={};u(this.a,this.b[0])};
function t(a,b,c){c=void 0===c?!1:c;for(a.c.push.apply(a.c,b);!1===a.f&&0<a.c.length;){b=a.c.shift();if("array"==g(b))a:{var d=a.a;if("string"==g(b[0])){for(var e=b[0].split("."),k=e.pop(),p=b.slice(1),l=0;l<e.length;l++){if(void 0===d[e[l]])break a;d=d[e[l]]}try{d[k].apply(d,p)}catch(w){}}}else if("arguments"!==g(b))if("function"==typeof b)try{b.call(a.g)}catch(w){}else if(m(b))for(var r in b)u(v(r,b[r]),a.a);else continue;c||(a.f=!0,a.h(a.a,b),a.f=!1)}}window.DataLayerHelper=n;
function q(a){return{set:function(b,c){u(v(b,c),a.a)},get:function(b){return a.get(b)}}}function v(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function u(a,b){for(var c in a)if(h(a,c)){var d=a[c];"array"==g(d)?("array"==g(b[c])||(b[c]=[]),u(d,b[c])):m(d)?(m(b[c])||(b[c]={}),u(d,b[c])):b[c]=d}};})();
