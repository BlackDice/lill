!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.lill=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* The MIT License (MIT)
* Copyright © 2014 Daniel K. (FredyC)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
* 
* Version: 0.3.2
*/
'use strict';
var LiLL, Symbol, add, attach, bData, bOwner, checkAttached, checkItem, clear, detach, each, each$noContext, each$withContext, getHead, getNext, getPrevious, getSize, getTail, has, idSequence, isAttached, remove;

Symbol = require('es6-symbol');

bData = Symbol('lill related data');

bOwner = Symbol('lill owner of item');

idSequence = 0;

attach = function(owner) {
  var data, _ref;
  if (!(owner && ((_ref = typeof owner) === 'object' || _ref === 'function'))) {
    throw new TypeError('LiLL.attach needs an object or function');
  }
  if (owner[bData]) {
    throw new TypeError('LiLL.attach cannot use already attached object');
  }
  if (!Object.isExtensible(owner)) {
    throw new TypeError('LiLL.attach needs extensible object');
  }
  owner[bData] = data = {
    owner: Symbol('lill parent owner'),
    next: Symbol('lill next item'),
    prev: Symbol('lill previous item'),
    head: null,
    tail: null,
    size: 0,
    id: idSequence
  };
  idSequence += 1;
  Object.seal(data);
  return owner;
};

detach = function(owner) {
  if (!owner[bData]) {
    return owner;
  }
  clear(owner);
  delete owner[bData];
  return owner;
};

add = function(owner, item) {
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
    data.tail[data.next] = item;
    item[data.prev] = data.tail;
    data.tail = item;
  }
  data.size += 1;
  return owner;
};

has = function(owner, item) {
  var data;
  data = checkAttached(owner);
  checkItem(owner, item, 'has');
  return item[data.owner] === owner;
};

remove = function(owner, item) {
  var data, next, prev;
  data = checkAttached(owner);
  checkItem(owner, item, 'remove');
  if (item[data.owner] !== owner) {
    return owner;
  }
  if (data.head === item) {
    data.head = data.head[data.next];
  }
  if (data.tail === item) {
    data.tail = data.tail[data.prev];
  }
  if (prev = item[data.prev]) {
    prev[data.next] = item[data.next];
  }
  if (next = item[data.next]) {
    next[data.prev] = item[data.prev];
  }
  delete item[data.next];
  delete item[data.prev];
  delete item[data.owner];
  data.size -= 1;
  return owner;
};

clear = function(owner) {
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

getHead = function(owner) {
  var data;
  data = checkAttached(owner);
  return data.head;
};

getTail = function(owner) {
  var data;
  data = checkAttached(owner);
  return data.tail;
};

getNext = function(owner, item) {
  var data;
  data = checkAttached(owner);
  return item != null ? item[data.next] : void 0;
};

getPrevious = function(owner, item) {
  var data;
  data = checkAttached(owner);
  return item != null ? item[data.prev] : void 0;
};

getSize = function(owner) {
  var data;
  data = checkAttached(owner);
  return data.size;
};

each = function(owner, cb, ctx) {
  var data, i, item, iterator, next;
  data = checkAttached(owner);
  if (typeof cb !== 'function') {
    throw new TypeError('LiLL.each method expects callback function');
  }
  i = 0;
  if (!(item = data.head)) {
    return i;
  }
  iterator = ctx !== void 0 ? each$withContext : each$noContext;
  while (true) {
    next = item[data.next];
    iterator(cb, item, i, ctx);
    if (!(item = next)) {
      break;
    }
    i += 1;
  }
  return i;
};

each$noContext = function(fn, item, i) {
  return fn(item, i);
};

each$withContext = function(fn, item, i, ctx) {
  return fn.call(ctx, item, i);
};

isAttached = function(owner) {
  return owner[bData] != null;
};

checkAttached = function(owner) {
  var data;
  if (data = owner != null ? owner[bData] : void 0) {
    return data;
  }
  throw new TypeError('use LiLL.attach() method on owner object');
};

checkItem = function(owner, item, method) {
  var _ref;
  if (!(item && ((_ref = typeof item) === 'object' || _ref === 'function'))) {
    throw new TypeError("LiLL." + method + " needs an object or function to be added");
  }
  if (!Object.isExtensible(item)) {
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
  isAttached: isAttached
};

module.exports = Object.freeze(LiLL);

},{"es6-symbol":2}],2:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":3,"./polyfill":17}],3:[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try {
		if (String(symbol) !== 'Symbol (test symbol)') return false;
	} catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.isRegExp !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],4:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":5,"es5-ext/object/is-callable":8,"es5-ext/object/normalize-options":12,"es5-ext/string/#/contains":14}],5:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":6,"./shim":7}],6:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],7:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":9,"../valid-value":13}],8:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],9:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":10,"./shim":11}],10:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],11:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],12:[function(require,module,exports){
'use strict';

var assign = require('./assign')

  , forEach = Array.prototype.forEach
  , create = Object.create, getPrototypeOf = Object.getPrototypeOf

  , process;

process = function (src, obj) {
	var proto = getPrototypeOf(src);
	return assign(proto ? process(proto, obj) : obj, src);
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{"./assign":5}],13:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],14:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":15,"./shim":16}],15:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],16:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],17:[function(require,module,exports){
'use strict';

var d = require('d')

  , create = Object.create, defineProperties = Object.defineProperties
  , generateName, Symbol;

generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		return '@@' + desc;
	};
}());

module.exports = Symbol = function (description) {
	var symbol;
	if (this instanceof Symbol) {
		throw new TypeError('TypeError: Symbol is not a constructor');
	}
	symbol = create(Symbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};

Object.defineProperties(Symbol, {
	create: d('', Symbol('create')),
	hasInstance: d('', Symbol('hasInstance')),
	isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
	isRegExp: d('', Symbol('isRegExp')),
	iterator: d('', Symbol('iterator')),
	toPrimitive: d('', Symbol('toPrimitive')),
	toStringTag: d('', Symbol('toStringTag')),
	unscopables: d('', Symbol('unscopables'))
});

defineProperties(Symbol.prototype, {
	properToString: d(function () {
		return 'Symbol (' + this.__description__ + ')';
	}),
	toString: d('', function () { return this.__name__; })
});
Object.defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
	function (hint) {
		throw new TypeError("Conversion of symbol objects is not allowed");
	}));
Object.defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));

},{"d":4}]},{},[1])(1)
});