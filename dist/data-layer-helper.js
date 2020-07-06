(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var g=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function h(a){return null==a?String(a):(a=g.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function k(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function m(a){if(!a||"object"!=h(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!k(a,"constructor")&&!k(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||k(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function n(a,b,c){this.b=a;this.h=b||function(){};this.f=!1;this.a={};this.c=[];this.g=q(this);t(this,a,!c);var d=a.push,e=this;a.push=function(){var f=[].slice.call(arguments,0),p=d.apply(a,f);t(e,f);return p}}window.DataLayerHelper=n;n.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};n.prototype.flatten=function(){this.b.splice(0,this.b.length);this.b[0]={};u(this.a,this.b[0])};
function t(a,b,c){for(a.c.push.apply(a.c,b);!1===a.f&&0<a.c.length;){b=a.c.shift();if("array"==h(b))a:{var d=b,e=a.a;if("string"==h(d[0])){var f=d[0].split("."),p=f.pop();d=d.slice(1);for(var l=0;l<f.length;l++){if(void 0===e[f[l]])break a;e=e[f[l]]}try{e[p].apply(e,d)}catch(w){}}}else if("arguments"!==h(b))if("function"==typeof b)try{b.call(a.g)}catch(w){}else if(m(b))for(var r in b)u(v(r,b[r]),a.a);else continue;c||(a.f=!0,a.h(a.a,b),a.f=!1)}}
function q(a){return{set:function(b,c){u(v(b,c),a.a)},get:function(b){return a.get(b)}}}function v(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function u(a,b){for(var c in a)if(k(a,c)){var d=a[c];"array"==h(d)?("array"==h(b[c])||(b[c]=[]),u(d,b[c])):m(d)?(m(b[c])||(b[c]={}),u(d,b[c])):b[c]=d}};})();
