/*
* The MIT License (MIT)
* Copyright © 2014 Daniel K. (FredyC)
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
'use strict';
var LiLL, Symbol, add, attach, checkAttached, checkItem, detach, each, getHead, getSize, getTail, has, remove, sData, sHead, sNext, sOwner, sPrev, sSize, sTail;

Symbol = require('es6-symbol');

sData = Symbol('linked list related data');

sHead = Symbol('reference to start of the list');

sTail = Symbol('reference to end of the list');

sSize = Symbol('counter of items in the list');

sNext = Symbol('next item in linked list');

sPrev = Symbol('previous item in linked list');

sOwner = Symbol('owner of the item');

attach = function(owner) {
  var data, _ref;
  if (!(owner && ((_ref = typeof owner) === 'object' || _ref === 'function'))) {
    throw new TypeError('LiLL.attach needs an object or function');
  }
  if (!Object.isExtensible(owner)) {
    throw new TypeError('LiLL.attach needs extensible object');
  }
  owner[sData] = data = Object.create(null);
  data[sHead] = null;
  data[sTail] = null;
  data[sSize] = 0;
  return owner;
};

detach = function(owner) {
  var data, item;
  data = checkAttached(owner);
  while (item = data[sHead]) {
    data[sHead] = item[sNext];
    delete item[sNext];
    delete item[sPrev];
    delete item[sOwner];
  }
  delete owner[sData];
  return owner;
};

add = function(owner, item) {
  var data;
  data = checkAttached(owner);
  checkItem(owner, item, 'add');
  if (item[sOwner]) {
    return owner;
  }
  item[sNext] = item[sPrev] = null;
  item[sOwner] = owner;
  if (!data[sHead]) {
    data[sHead] = data[sTail] = item;
  } else {
    data[sTail][sNext] = item;
    item[sPrev] = data[sTail];
    data[sTail] = item;
  }
  data[sSize] += 1;
  return owner;
};

has = function(owner, item) {
  var data;
  data = checkAttached(owner);
  checkItem(owner, item, 'has');
  return item[sOwner] === owner;
};

remove = function(owner, item) {
  var data, next, prev;
  data = checkAttached(owner);
  checkItem(owner, item, 'remove');
  if (!item[sOwner]) {
    return owner;
  }
  if (data[sHead] === item) {
    data[sHead] = data[sHead][sNext];
  }
  if (data[sTail] === item) {
    data[sTail] = data[sTail][sPrev];
  }
  if (prev = item[sPrev]) {
    prev[sNext] = item[sNext];
  }
  if (next = item[sNext]) {
    next[sPrev] = item[sPrev];
  }
  delete item[sNext];
  delete item[sPrev];
  delete item[sOwner];
  data[sSize] -= 1;
  return owner;
};

getHead = function(owner) {
  var data;
  data = checkAttached(owner);
  return data[sHead];
};

getTail = function(owner) {
  var data;
  data = checkAttached(owner);
  return data[sTail];
};

getSize = function(owner) {
  var data;
  data = checkAttached(owner);
  return data[sSize];
};

each = function(owner, cb, ctx) {
  var data, i, item, _results;
  data = checkAttached(owner);
  if (typeof cb !== 'function') {
    throw new TypeError('LiLL.each method expects callback function');
  }
  if (!(item = data[sHead])) {
    return;
  }
  i = 0;
  ctx || (ctx = cb);
  _results = [];
  while (true) {
    cb.call(ctx, item, i++);
    item = item[sNext];
    if (!item) {
      break;
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

checkAttached = function(owner) {
  var data;
  if (data = owner != null ? owner[sData] : void 0) {
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
  if (item[sOwner] && item[sOwner] !== owner) {
    throw new TypeError("LiLL cannot " + method + " item that is managed by another list");
  }
};

LiLL = {
  attach: attach,
  detach: detach,
  add: add,
  has: has,
  remove: remove,
  getHead: getHead,
  getTail: getTail,
  getSize: getSize,
  each: each
};

LiLL.sNext = sNext;

LiLL.sPrev = sPrev;

Object.freeze(LiLL);

module.exports = LiLL;
