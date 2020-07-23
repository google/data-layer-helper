(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var g=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function k(a){return null==a?String(a):(a=g.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=k(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(e){return!1}for(var b in a);return void 0===b||m(a,b)};function p(a,b){var e={},c=e;a=a.split(".");for(var d=0;d<a.length-1;d++)c=c[a[d]]={};c[a[a.length-1]]=b;return e}function q(a,b){var e=!a._clear,c;for(c in a)if(m(a,c)){var d=a[c];"array"===k(d)&&e?("array"===k(b[c])||(b[c]=[]),q(d,b[c])):n(d)&&e?(n(b[c])||(b[c]={}),q(d,b[c])):b[c]=d}delete b._clear}function r(a,b){switch(b){case 1:console.log(a);break;case 2:console.warn(a);break;case 3:console.error(a)}};/*
 Copyright 2012 Google Inc. All rights reserved. */
function t(a,b,e){this.f=a;this.i=void 0===b?function(){}:b;this.g=!1;this.b={};this.c=[];this.a={};this.h=w(this);x(this,a,!(void 0===e?0:e));y(this,function(){if(1===arguments.length&&"object"===k(arguments[0]))q(arguments[0],this);else if(2===arguments.length&&"string"===k(arguments[0])){var f=p(arguments[0],arguments[1]);q(f,this)}});var c=a.push,d=this;a.push=function(){var f=[].slice.call(arguments,0),l=c.apply(a,f);x(d,f);return l}}
t.prototype.get=function(a){var b=this.b;a=a.split(".");for(var e=0;e<a.length;e++){if(void 0===b[a[e]])return;b=b[a[e]]}return b};t.prototype.flatten=function(){this.f.splice(0,this.f.length);this.f[0]={};q(this.b,this.f[0])};function y(a,b){"set"in a.a||(a.a.set=[]);a.a.set.push(b)}
function x(a,b,e){e=void 0===e?!1:e;for(a.c.push.apply(a.c,b);!1===a.g&&0<a.c.length;){b=a.c.shift();if("array"===k(b))a:{var c=a.b;"string"===k(b[0])||r("Error processing command, no command was run. The first argument must be of type string, but was of type "+(typeof b[0]+".\nThe command run was "+b),2);for(var d=b[0].split("."),f=d.pop(),l=b.slice(1),h=0;h<d.length;h++){if(void 0===c[d[h]]){r("Error processing command, no command was run as the object at "+(d+" was undefined.\nThe command run was "+
b),2);break a}c=c[d[h]]}try{c[f].apply(c,l)}catch(u){r("An exception was thrown by the method "+(f+", so no command was run.\nThe method was called on the data layer object at the location ")+(d+"."),3)}}else if("arguments"===k(b)){d=a;f=[];l=b[0];if(d.a[l])for(c=d.a[l].length,h=0;h<c;h++)f.push(d.a[l][h].apply(d.h,[].slice.call(b,1)));a.c.push.apply(a.c,f)}else if("function"==typeof b)try{b.call(a.h)}catch(u){r("An exception was thrown when running the method "+(b+", execution was skipped."),3),
r(u,3)}else if(n(b))for(var v in b)q(p(v,b[v]),a.b);else continue;e||(a.g=!0,a.i(a.b,b),a.g=!1)}}window.DataLayerHelper=t;function w(a){return{set:function(b,e){q(p(b,e),a.b)},get:function(b){return a.get(b)}}};})();
