(function(){/*

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/
'use strict';/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)\]/;function l(a){return null==a?String(a):(a=k.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function m(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function n(a){if(!a||"object"!=l(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!m(a,"constructor")&&!m(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}for(var b in a);return void 0===b||m(a,b)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function p(a,b,c){this.c=a;this.i=void 0===b?function(){}:b;this.g=!1;this.a={};this.b=[];this.f={};this.h=q(this);r(this,a,!(void 0===c?0:c));var d=a.push,e=this;a.push=function(){var f=[].slice.call(arguments,0),h=d.apply(a,f);r(e,f);return h}}p.prototype.get=function(a){var b=this.a;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};p.prototype.flatten=function(){this.c.splice(0,this.c.length);this.c[0]={};t(this.a,this.c[0])};
function r(a,b,c){c=void 0===c?!1:c;for(a.b.push.apply(a.b,b);!1===a.g&&0<a.b.length;){b=a.b.shift();if("array"===l(b))a:{var d=a.a;"string"===l(b[0])||u("Error processing command, no command was run. The first argument must be of type string, but was of type "+(typeof b[0]+". \nYou pushed the command\n "+b+"."),x);for(var e=b[0].split("."),f=e.pop(),h=b.slice(1),g=0;g<e.length;g++){if(void 0===d[e[g]]){u("The object at \n"+e+"\n was undefined, so thecommand \n"+(b+" was ignored."),x);break a}d=d[e[g]]}try{d[f].apply(d,
h)}catch(v){u("An exception was thrown by the method\n"+(f+"\n, so no command was run.\n"+f+" was called on the object stored in \n")+(e+" of data layer helper."),y)}}else if("arguments"===l(b)){e=a;f=[];h=b[0];if(e.f[h])for(d=e.f[h].length,g=0;g<d;g++)f.push(e.f[h][g].apply(e.h,[].slice.call(b,1)));a.b.push.apply(a.b,f)}else if("function"==typeof b)try{b.call(a.h)}catch(v){u("An exception was thrown when running the method \n"+(b+", execution was skipped."),y),u(v,y)}else if(n(b))for(var w in b)t(z(w,
b[w]),a.a);else continue;c||(a.g=!0,a.i(a.a,b),a.g=!1)}}window.DataLayerHelper=p;function q(a){return{set:function(b,c){t(z(b,c),a.a)},get:function(b){return a.get(b)}}}function z(a,b){var c={},d=c;a=a.split(".");for(var e=0;e<a.length-1;e++)d=d[a[e]]={};d[a[a.length-1]]=b;return c}function t(a,b){for(var c in a)if(m(a,c)){var d=a[c];"array"===l(d)?("array"===l(b[c])||(b[c]=[]),t(d,b[c])):n(d)?(n(b[c])||(b[c]={}),t(d,b[c])):b[c]=d}}var A=1,x=2,y=3;
function u(a,b){switch(b){case A:console.log(a);break;case x:console.warn(a);break;case y:console.error(a)}};})();
