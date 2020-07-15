(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var f=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function h(a){return null==a?String(a):(a=f.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function k(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function m(a){if(!a||"object"!=h(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!k(a,"constructor")&&!k(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||k(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function n(a,b,c){this.b=a;this.h=void 0===b?function(){}:b;this.f=!1;this.a={};this.c=[];this.g=r(this);u(this,a,!(void 0===c?0:c));var d=a.push,e=this;a.push=function(){var g=[].slice.call(arguments,0),p=d.apply(a,g);u(e,g);return p}}n.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};n.prototype.flatten=function(){this.b.splice(0,this.b.length);this.b[0]={};v(this.a,this.b[0])};
function u(a,b,c){c=void 0===c?!1:c;for(a.c.push.apply(a.c,b);!1===a.f&&0<a.c.length;){b=a.c.shift();if("array"==h(b))a:{var d=a.a;if("string"==h(b[0])){for(var e=b[0].split("."),g=e.pop(),p=b.slice(1),l=0;l<e.length;l++){if(void 0===d[e[l]]){console.warn("You pushed the array "+b+" to the data layer. However, no object was found at the location "+(e+", so no command was run. "));break a}d=d[e[l]]}try{d[g].apply(d,p)}catch(q){console.error("When trying to run the method "+g+" on "+(e+", an exception was thrown.")),
console.error(q)}}else console.warn("You pushed the array "+b+" to the data layer. However, "+(b[0]+" is not a string, so no command was run. To call a method, please use the string 'objectLocation.method'as the first parameter."))}else if("arguments"!==h(b))if("function"==typeof b)try{b.call(a.g)}catch(q){console.error("When running the method "+b+", an exception was thrown."),console.error(q)}else if(m(b))for(var t in b)v(w(t,b[t]),a.a);else continue;c||(a.f=!0,a.h(a.a,b),a.f=!1)}}
window.DataLayerHelper=n;function r(a){return{set:function(b,c){v(w(b,c),a.a)},get:function(b){return a.get(b)}}}function w(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function v(a,b){for(var c in a)if(k(a,c)){var d=a[c];"array"==h(d)?("array"==h(b[c])||(b[c]=[]),v(d,b[c])):m(d)?(m(b[c])||(b[c]={}),v(d,b[c])):b[c]=d}};})();
