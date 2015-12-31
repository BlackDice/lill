const bData = Symbol('lill related data');
const bOwner = Symbol('lill owner of item');

let idSequence = 0;

export function attach(owner) {
  if (!canBeAttached(owner)) {
    throw new TypeError('LiLL.attach needs an extensible object or function');
  }
  if (isAttached(owner)) {
    throw new TypeError('LiLL.attach cannot use already attached object');
  }

  owner[bData] = {
    bOwner: Symbol('lill parent owner'),
    bNext: Symbol('lill next item'),
    bPrev: Symbol('lill previous item'),
    head: null,
    tail: null,
    size: 0,
    id: (idSequence += 1)
  };

  Object.seal(owner[bData]);
  return owner;
}

export function detach(owner) {
  if (!owner[bData]) {
    return owner;
  }
  clear(owner);
  delete owner[bData];
  return owner;
};

export function add(owner, item) {
  const data = validateAttached(owner);
  validateItem(item, 'add');

  // item is already on this list
  if (item[data.bOwner] === owner) {
    return owner;
  }

  // initial state
  item[data.bNext] = item[data.bPrev] = null;
  item[data.bOwner] = owner;

  // no head means there are no items at all
  if (!data.head) {
    data.head = data.tail = item;
  } else {
    // item on the tail will link with new item
    data.tail[data.bNext] = item;
    item[data.bPrev] = data.tail;

    // add new item on the tail
    data.tail = item;
  }

  data.size += 1;
  return owner;
};

export function has(owner, item) {
  const data = validateAttached(owner);
  validateItem(item, 'has');

  return item[data.bOwner] === owner;
};

export function remove(owner, item) {
  const data = validateAttached(owner);
  validateItem(item, 'remove');

  // item is not on this list
  if (item[data.bOwner] !== owner) {
    return owner;
  }

  // shift head since the current is being removed
  if (data.head === item) {
    data.head = data.head[data.bNext];
  }

  // shift tail since the current is being removed
  if (data.tail === item) {
    data.tail = data.tail[data.bPrev];
  }

  const prev = item[data.bPrev];
  const next = item[data.bNext];

  // update neighbors
  if (prev) {
    prev[data.bNext] = item[data.bNext];
  }
  if (next) {
    next[data.bPrev] = item[data.bPrev];
  }

  // cleanup of removed item
  delete item[data.bNext];
  delete item[data.bPrev];
  delete item[data.bOwner];

  data.size -= 1;
  return owner;
};

export function clear(owner) {
  const data = validateAttached(owner);

  let item;
  while (item = data.head) {
    data.head = item[data.bNext];
    delete item[data.bNext];
    delete item[data.bPrev];
    delete item[data.bOwner];
  }

  data.head = data.tail = null;
  data.size = 0;

  return owner;
};

export function getHead(owner) {
  const data = validateAttached(owner);
  return data.head;
};

export function getTail(owner) {
  const data = validateAttached(owner);
  return data.tail;
};

export function getNext(owner, item) {
  const data = validateAttached(owner);
  return item != null ? item[data.bNext] : void 0;
};

export function getPrevious(owner, item) {
  const data = validateAttached(owner);
  return item != null ? item[data.bPrev] : void 0;
};

export function getSize(owner) {
  const data = validateAttached(owner);
  return data.size;
};

function func$noContext(fn, item, i) {
  return fn(item, i);
};

function func$withContext(fn, item, i, ctx) {
  return fn.call(ctx, item, i);
};

export function each(owner, cb, ctx) {
  const data = validateAttached(owner);

  if (typeof cb !== 'function') {
    throw new TypeError('LiLL.each method expects callback function');
  }

  const func = ctx !== void 0 ? func$withContext : func$noContext;

  let i = 0;
  let item = data.head;

  while (item) {
    // keep reference to next item in case the callback would modify the list
    const next = item[data.bNext];
    func(cb, item, i, ctx);
    item = next;
    i += 1;
  }

  return i;
};

export function find(owner, predicate, ctx) {
  const data = validateAttached(owner);

  if (typeof predicate !== 'function') {
    throw new TypeError('LiLL.find method expects predicate function');
  }

  let i = 0;
  let item = data.head;

  const func = ctx !== void 0 ? func$withContext : func$noContext;

  while (item) {
    const next = item[data.bNext];
    const result = func(predicate, item, i, ctx);
    if (result === true) {
      return item;
    }
    item = next;
    i += 1;
  }

  return null;
};

export function isAttached(owner) {
  return owner != null && owner[bData] != null;
}

export function canBeAttached(object) {
  if (object === null) {
    return false;
  }
  const objectType = typeof object;
  return (objectType === 'object' || objectType === 'function') && Object.isExtensible(object);
}

function validateAttached(owner) {
  if (!isAttached(owner)) {
    throw new TypeError('use LiLL.attach() method to setup owner object');
  }
  return owner[bData];
};

function validateItem(item, method) {
  if (!canBeAttached(item)) {
    throw new TypeError("LiLL." + method + " needs an extensible object or function");
  }
};

// to allow `import Lill from 'lill'` syntax
export default module.exports;