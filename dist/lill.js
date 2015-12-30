/*!
 * The MIT License (MIT)
 * Copyright © 2015 Daniel K. (FredyC)
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("LiLL", [], factory);
	else if(typeof exports === 'object')
		exports["LiLL"] = factory();
	else
		root["LiLL"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************!*\
  !*** ./src/lill.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _freeze = __webpack_require__(/*! babel-runtime/core-js/object/freeze */ 16);

	var _freeze2 = _interopRequireDefault(_freeze);

	var _seal = __webpack_require__(/*! babel-runtime/core-js/object/seal */ 18);

	var _seal2 = _interopRequireDefault(_seal);

	var _isExtensible = __webpack_require__(/*! babel-runtime/core-js/object/is-extensible */ 17);

	var _isExtensible2 = _interopRequireDefault(_isExtensible);

	var _symbol = __webpack_require__(/*! babel-runtime/core-js/symbol */ 19);

	var _symbol2 = _interopRequireDefault(_symbol);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var LiLL, add, attach, bData, bOwner, checkAttached, checkItem, clear, detach, each, find, func$noContext, func$withContext, getHead, getNext, getPrevious, getSize, getTail, has, idSequence, isAttached, remove;

	bData = (0, _symbol2.default)('lill related data');

	bOwner = (0, _symbol2.default)('lill owner of item');

	idSequence = 0;

	attach = function (owner) {
	  var data, ref;
	  if (!(owner && ((ref = typeof owner) === 'object' || ref === 'function'))) {
	    throw new TypeError('LiLL.attach needs an object or function');
	  }
	  if (owner[bData]) {
	    throw new TypeError('LiLL.attach cannot use already attached object');
	  }
	  if (!(0, _isExtensible2.default)(owner)) {
	    throw new TypeError('LiLL.attach needs extensible object');
	  }
	  owner[bData] = data = {
	    owner: (0, _symbol2.default)('lill parent owner'),
	    next: (0, _symbol2.default)('lill next item'),
	    prev: (0, _symbol2.default)('lill previous item'),
	    head: null,
	    tail: null,
	    size: 0,
	    id: idSequence
	  };
	  idSequence += 1;
	  (0, _seal2.default)(data);
	  return owner;
	};

	detach = function (owner) {
	  if (!owner[bData]) {
	    return owner;
	  }
	  clear(owner);
	  delete owner[bData];
	  return owner;
	};

	add = function (owner, item) {
	  var data;
	  data = checkAttached(owner);
	  checkItem(owner, item, 'add');
	  if (item[data.owner] === owner) {
	    return owner;
	  }
	  item[data.next] = item[data.prev] = null;
	  item[data.owner] = owner;
	  if (!data.head) {
	    data.head = data.tail = item;
	  } else {
	    // current tail item points to added item
	    data.tail[data.next] = item;
	    // added item points to the current tail
	    item[data.prev] = data.tail;
	    // tail points to added item
	    data.tail = item;
	  }
	  data.size += 1;
	  return owner;
	};

	has = function (owner, item) {
	  var data;
	  data = checkAttached(owner);
	  checkItem(owner, item, 'has');
	  return item[data.owner] === owner;
	};

	remove = function (owner, item) {
	  var data, next, prev;
	  data = checkAttached(owner);
	  checkItem(owner, item, 'remove');
	  if (item[data.owner] !== owner) {
	    return owner;
	  }
	  // shift head since the current is being removed
	  if (data.head === item) {
	    data.head = data.head[data.next];
	  }
	  // shift tail since the current is being removed
	  if (data.tail === item) {
	    data.tail = data.tail[data.prev];
	  }
	  // update neighbors
	  if (prev = item[data.prev]) {
	    prev[data.next] = item[data.next];
	  }
	  if (next = item[data.next]) {
	    next[data.prev] = item[data.prev];
	  }
	  // cleanup of removed item
	  delete item[data.next];
	  delete item[data.prev];
	  delete item[data.owner];
	  data.size -= 1;
	  return owner;
	};

	clear = function (owner) {
	  var data, item;
	  data = checkAttached(owner);
	  while (item = data.head) {
	    data.head = item[data.next];
	    delete item[data.next];
	    delete item[data.prev];
	    delete item[data.owner];
	  }
	  data.head = data.tail = null;
	  data.size = 0;
	  return owner;
	};

	getHead = function (owner) {
	  var data;
	  data = checkAttached(owner);
	  return data.head;
	};

	getTail = function (owner) {
	  var data;
	  data = checkAttached(owner);
	  return data.tail;
	};

	getNext = function (owner, item) {
	  var data;
	  data = checkAttached(owner);
	  return item != null ? item[data.next] : void 0;
	};

	getPrevious = function (owner, item) {
	  var data;
	  data = checkAttached(owner);
	  return item != null ? item[data.prev] : void 0;
	};

	getSize = function (owner) {
	  var data;
	  data = checkAttached(owner);
	  return data.size;
	};

	each = function (owner, cb, ctx) {
	  var data, i, item, iterator, next;
	  data = checkAttached(owner);
	  if (typeof cb !== 'function') {
	    throw new TypeError('LiLL.each method expects callback function');
	  }
	  i = 0;
	  if (!(item = data.head)) {
	    return i;
	  }
	  iterator = ctx !== void 0 ? func$withContext : func$noContext;
	  while (true) {
	    // storing next item now for cases where badly written
	    // iterator function would modify the list
	    next = item[data.next];
	    iterator(cb, item, i, ctx);
	    if (!(item = next)) {
	      break;
	    }
	    i += 1;
	  }
	  return i;
	};

	find = function (owner, predicate, ctx) {
	  var data, func, i, item, next, result;
	  data = checkAttached(owner);
	  if (typeof predicate !== 'function') {
	    throw new TypeError('LiLL.find method expects predicate function');
	  }
	  if (!(item = data.head)) {
	    return null;
	  }
	  func = ctx !== void 0 ? func$withContext : func$noContext;
	  i = 0;
	  while (true) {
	    next = item[data.next];
	    result = func(predicate, item, i, ctx);
	    if (result === true) {
	      return item;
	    }
	    if (!(item = next)) {
	      break;
	    }
	    i += 1;
	  }
	  return null;
	};

	func$noContext = function (fn, item, i) {
	  return fn(item, i);
	};

	func$withContext = function (fn, item, i, ctx) {
	  return fn.call(ctx, item, i);
	};

	isAttached = function (owner) {
	  return owner[bData] != null;
	};

	checkAttached = function (owner) {
	  var data;
	  if (data = owner != null ? owner[bData] : void 0) {
	    return data;
	  }
	  throw new TypeError('use LiLL.attach() method on owner object');
	};

	checkItem = function (owner, item, method) {
	  var ref;
	  if (!(item && ((ref = typeof item) === 'object' || ref === 'function'))) {
	    throw new TypeError("LiLL." + method + " needs an object or function to be added");
	  }
	  if (!(0, _isExtensible2.default)(item)) {
	    throw new TypeError("LiLL." + method + " method needs an extensible item");
	  }
	  if (item[bOwner] && item[bOwner] !== owner) {
	    throw new TypeError("LiLL cannot " + method + " item that is managed by another list");
	  }
	};

	LiLL = {
	  attach: attach,
	  detach: detach,
	  add: add,
	  has: has,
	  remove: remove,
	  clear: clear,
	  getHead: getHead,
	  getTail: getTail,
	  getNext: getNext,
	  getPrevious: getPrevious,
	  getSize: getSize,
	  each: each,
	  find: find,
	  isAttached: isAttached
	};

	module.exports = (0, _freeze2.default)(LiLL);

	// ---
	// generated by coffee-script 1.9.2

/***/ },
/* 1 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.core.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 2 */
/*!********************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.js ***!
  \********************************************************/
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 3 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.global.js ***!
  \***************************************************************/
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 4 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.is-object.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 5 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.fails.js ***!
  \**************************************************************/
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 6 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.object-sap.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(/*! ./$.export */ 10)
	  , core    = __webpack_require__(/*! ./$.core */ 1)
	  , fails   = __webpack_require__(/*! ./$.fails */ 5);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 7 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.to-iobject.js ***!
  \*******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(/*! ./$.iobject */ 31)
	  , defined = __webpack_require__(/*! ./$.defined */ 27);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 8 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.cof.js ***!
  \************************************************************/
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 9 */
/*!********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.descriptors.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./$.fails */ 5)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 10 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.export.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(/*! ./$.global */ 3)
	  , core      = __webpack_require__(/*! ./$.core */ 1)
	  , ctx       = __webpack_require__(/*! ./$.ctx */ 26)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 11 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.has.js ***!
  \************************************************************/
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 12 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.property-desc.js ***!
  \**********************************************************************/
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 13 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.shared.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./$.global */ 3)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 14 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.uid.js ***!
  \************************************************************/
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 15 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.wks.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(/*! ./$.shared */ 13)('wks')
	  , uid    = __webpack_require__(/*! ./$.uid */ 14)
	  , Symbol = __webpack_require__(/*! ./$.global */ 3).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 16 */
/*!**************************************************!*\
  !*** ./~/babel-runtime/core-js/object/freeze.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/freeze */ 20), __esModule: true };

/***/ },
/* 17 */
/*!*********************************************************!*\
  !*** ./~/babel-runtime/core-js/object/is-extensible.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/is-extensible */ 21), __esModule: true };

/***/ },
/* 18 */
/*!************************************************!*\
  !*** ./~/babel-runtime/core-js/object/seal.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/seal */ 22), __esModule: true };

/***/ },
/* 19 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/core-js/symbol.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 23), __esModule: true };

/***/ },
/* 20 */
/*!***************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/freeze.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.freeze */ 37);
	module.exports = __webpack_require__(/*! ../../modules/$.core */ 1).Object.freeze;

/***/ },
/* 21 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/is-extensible.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.is-extensible */ 38);
	module.exports = __webpack_require__(/*! ../../modules/$.core */ 1).Object.isExtensible;

/***/ },
/* 22 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/object/seal.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.seal */ 39);
	module.exports = __webpack_require__(/*! ../../modules/$.core */ 1).Object.seal;

/***/ },
/* 23 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/fn/symbol/index.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.symbol */ 41);
	__webpack_require__(/*! ../../modules/es6.object.to-string */ 40);
	module.exports = __webpack_require__(/*! ../../modules/$.core */ 1).Symbol;

/***/ },
/* 24 */
/*!*******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.a-function.js ***!
  \*******************************************************************/
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 25 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.an-object.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./$.is-object */ 4);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 26 */
/*!************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.ctx.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./$.a-function */ 24);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 27 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.defined.js ***!
  \****************************************************************/
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 28 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.enum-keys.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(/*! ./$ */ 2);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 29 */
/*!******************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.get-names.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(/*! ./$.to-iobject */ 7)
	  , getNames  = __webpack_require__(/*! ./$ */ 2).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 30 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.hide.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(/*! ./$ */ 2)
	  , createDesc = __webpack_require__(/*! ./$.property-desc */ 12);
	module.exports = __webpack_require__(/*! ./$.descriptors */ 9) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 31 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.iobject.js ***!
  \****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(/*! ./$.cof */ 8);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 32 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.is-array.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(/*! ./$.cof */ 8);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 33 */
/*!**************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.keyof.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(/*! ./$ */ 2)
	  , toIObject = __webpack_require__(/*! ./$.to-iobject */ 7);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 34 */
/*!****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.library.js ***!
  \****************************************************************/
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 35 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.redefine.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./$.hide */ 30);

/***/ },
/* 36 */
/*!**************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/$.set-to-string-tag.js ***!
  \**************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(/*! ./$ */ 2).setDesc
	  , has = __webpack_require__(/*! ./$.has */ 11)
	  , TAG = __webpack_require__(/*! ./$.wks */ 15)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 37 */
/*!************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.freeze.js ***!
  \************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.5 Object.freeze(O)
	var isObject = __webpack_require__(/*! ./$.is-object */ 4);

	__webpack_require__(/*! ./$.object-sap */ 6)('freeze', function($freeze){
	  return function freeze(it){
	    return $freeze && isObject(it) ? $freeze(it) : it;
	  };
	});

/***/ },
/* 38 */
/*!*******************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.is-extensible.js ***!
  \*******************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.11 Object.isExtensible(O)
	var isObject = __webpack_require__(/*! ./$.is-object */ 4);

	__webpack_require__(/*! ./$.object-sap */ 6)('isExtensible', function($isExtensible){
	  return function isExtensible(it){
	    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
	  };
	});

/***/ },
/* 39 */
/*!**********************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.seal.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.17 Object.seal(O)
	var isObject = __webpack_require__(/*! ./$.is-object */ 4);

	__webpack_require__(/*! ./$.object-sap */ 6)('seal', function($seal){
	  return function seal(it){
	    return $seal && isObject(it) ? $seal(it) : it;
	  };
	});

/***/ },
/* 40 */
/*!***************************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.object.to-string.js ***!
  \***************************************************************************/
/***/ function(module, exports) {

	

/***/ },
/* 41 */
/*!*****************************************************************!*\
  !*** ./~/babel-runtime/~/core-js/library/modules/es6.symbol.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(/*! ./$ */ 2)
	  , global         = __webpack_require__(/*! ./$.global */ 3)
	  , has            = __webpack_require__(/*! ./$.has */ 11)
	  , DESCRIPTORS    = __webpack_require__(/*! ./$.descriptors */ 9)
	  , $export        = __webpack_require__(/*! ./$.export */ 10)
	  , redefine       = __webpack_require__(/*! ./$.redefine */ 35)
	  , $fails         = __webpack_require__(/*! ./$.fails */ 5)
	  , shared         = __webpack_require__(/*! ./$.shared */ 13)
	  , setToStringTag = __webpack_require__(/*! ./$.set-to-string-tag */ 36)
	  , uid            = __webpack_require__(/*! ./$.uid */ 14)
	  , wks            = __webpack_require__(/*! ./$.wks */ 15)
	  , keyOf          = __webpack_require__(/*! ./$.keyof */ 33)
	  , $names         = __webpack_require__(/*! ./$.get-names */ 29)
	  , enumKeys       = __webpack_require__(/*! ./$.enum-keys */ 28)
	  , isArray        = __webpack_require__(/*! ./$.is-array */ 32)
	  , anObject       = __webpack_require__(/*! ./$.an-object */ 25)
	  , toIObject      = __webpack_require__(/*! ./$.to-iobject */ 7)
	  , createDesc     = __webpack_require__(/*! ./$.property-desc */ 12)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(/*! ./$.library */ 34)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }
/******/ ])
});
;