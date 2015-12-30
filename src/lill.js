var LiLL, add, attach, bData, bOwner, checkAttached, checkItem, clear, detach, each, find, func$noContext, func$withContext, getHead, getNext, getPrevious, getSize, getTail, has, idSequence, isAttached, remove;

bData = Symbol('lill related data');

bOwner = Symbol('lill owner of item');

idSequence = 0;

attach = function(owner) {
  var data, ref;
  if (!(owner && ((ref = typeof owner) === 'object' || ref === 'function'))) {
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

find = function(owner, predicate, ctx) {
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

func$noContext = function(fn, item, i) {
  return fn(item, i);
};

func$withContext = function(fn, item, i, ctx) {
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
  var ref;
  if (!(item && ((ref = typeof item) === 'object' || ref === 'function'))) {
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
  find: find,
  isAttached: isAttached
};

module.exports = Object.freeze(LiLL);

// ---
// generated by coffee-script 1.9.2