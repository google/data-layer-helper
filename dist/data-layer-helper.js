(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=l(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||m(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function p(a,b,c){this.f=a;this.i=b||function(){};this.g=!1;this.c={};this.a=[];this.b={};this.h=q(this);t(this,a,!c);var d=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),h=d.apply(a,g);t(e,g);return h}}window.DataLayerHelper=p;p.prototype.get=function(a){var b=this.c;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};p.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};u(this.c,this.f[0])};
p.prototype.registerProcessor=function(a,b){a in this.b||(this.b[a]=[]);this.b[a].push(b)};
function t(a,b,c){for(a.a.push.apply(a.a,b);!1===a.g&&0<a.a.length;){b=a.a.shift();if("array"==l(b))a:{var d=a.c;if("string"==l(b[0])){for(var e=b[0].split("."),g=e.pop(),h=b.slice(1),f=0;f<e.length;f++){if(void 0===d[e[f]])break a;d=d[e[f]]}try{d[g].apply(d,h)}catch(w){}}}else if("arguments"==l(b)){e=a;g=[];h=b[0];if(e.b[h])for(d=e.b[h].length,f=0;f<d;f++)g.push(e.b[h][f].apply(e.h,[].slice.call(b,1)));a.a.push.apply(a.a,g)}else if("function"==typeof b)try{b.call(a.h)}catch(w){}else if(n(b))for(var r in b)u(v(r,
b[r]),a.c);else continue;c||(a.g=!0,a.i(a.c,b),a.g=!1)}}function q(a){return{set:function(b,c){u(v(b,c),a.c)},get:function(b){return a.get(b)}}}function v(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function u(a,b){for(var c in a)if(m(a,c)){var d=a[c];"array"==l(d)?("array"==l(b[c])||(b[c]=[]),u(d,b[c])):n(d)?(n(b[c])||(b[c]={}),u(d,b[c])):b[c]=d}};})();
