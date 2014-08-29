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
