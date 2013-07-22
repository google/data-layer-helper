(function(){/*
 jQuery v1.9.1 (c) 2005, 2012
 jQuery Foundation, Inc. jquery.org/license.
*/
var e=/\[object (Boolean|Number|String|Function|Array|Date|RegExp)\]/;function f(a){return null==a?String(a):(a=e.exec(Object.prototype.toString.call(Object(a))))?a[1].toLowerCase():"object"}function h(a,b){return Object.prototype.hasOwnProperty.call(Object(a),b)}function k(a){if(!a||"object"!=f(a)||a.nodeType||a==a.window)return!1;try{if(a.constructor&&!h(a,"constructor")&&!h(a.constructor.prototype,"isPrototypeOf"))return!1}catch(b){return!1}for(var c in a);return void 0===c||h(a,c)};/*
 Copyright 2012 Google Inc. All rights reserved. */
function l(a,b,c){this.a=a;this.e=b||function(){};this.d=!1;this.b={};this.c=[];q(this,a,!c);var d=this,m=a.push;a.push=function(){var b=[].slice.call(arguments,0),c=m.apply(a,b);q(d,b);return c}}window.DataLayerHelper=l;l.prototype.get=function(a){var b=this.b;a=a.split(".");for(var c=0;c<a.length;c++){if(void 0===b[a[c]])return;b=b[a[c]]}return b};l.prototype.flatten=function(){this.a.splice(0,this.a.length);this.a[0]={};s(this.b,this.a[0])};
function q(a,b,c){for(a.c.push.apply(a.c,b);!1===a.d&&0<a.c.length;)if(b=a.c.shift(),k(b)){for(var d in b){for(var m=s,t=b[d],r={},n=r,g=d.split("."),p=0;p<g.length-1;p++)n=n[g[p]]={};n[g[g.length-1]]=t;m(r,a.b)}c||(a.d=!0,a.e(a.b,b),a.d=!1)}}function s(a,b){for(var c in a)if(h(a,c)){var d=a[c];"array"==f(d)?("array"==f(b[c])||(b[c]=[]),s(d,b[c])):k(d)?(k(b[c])||(b[c]={}),s(d,b[c])):b[c]=d}};})();
