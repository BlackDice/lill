'use strict'

Symbol = require 'es6-symbol'

bData = Symbol 'lill related data'
bOwner = Symbol 'lill owner of item'

idSequence = 0

attach = (owner) ->
  unless owner and typeof owner in ['object', 'function']
    throw new TypeError 'LiLL.attach needs an object or function'
  if owner[ bData ]
    throw new TypeError 'LiLL.attach cannot use already attached object'
  unless Object.isExtensible owner
    throw new TypeError 'LiLL.attach needs extensible object'

  owner[ bData ] = data =
    owner: Symbol 'lill parent owner'
    next: Symbol 'lill next item'
    prev: Symbol 'lill previous item'
    head: null
    tail: null
    size: 0
    id: idSequence

  idSequence += 1

  Object.seal data
  return owner

detach = (owner) ->
  return owner unless owner[ bData ]
  clear owner
  delete owner[ bData ]
  return owner

add = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'add'

  return owner if item[ data.owner ] is owner

  item[ data.next ] = item[ data.prev ] = null
  item[ data.owner ] = owner

  unless data.head
    data.head = data.tail = item
  else
    # Current tail item points to added item
    data.tail[ data.next ] = item
    # Added item points to the current tail
    item[ data.prev ] = data.tail
    # Tail points to added item
    data.tail = item

  data.size += 1
  return owner

has = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'has'

  return item[ data.owner ] is owner

remove = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'remove'

  return owner unless item[ data.owner ] is owner

  # Shift head since the current is being removed
  if data.head is item
    data.head = data.head[ data.next ]

  # Shift tail since the current is being removed
  if data.tail is item
    data.tail = data.tail[ data.prev ]

  # Update neighbors
  prev[ data.next ] = item[ data.next ] if prev = item[ data.prev ]
  next[ data.prev ] = item[ data.prev ] if next = item[ data.next ]

  # Cleanup of removed item
  delete item[ data.next ]
  delete item[ data.prev ]
  delete item[ data.owner ]

  data.size -= 1
  return owner

clear = (owner) ->
  data = checkAttached owner
  while item = data.head
    data.head = item[ data.next ]
    delete item[ data.next ]
    delete item[ data.prev ]
    delete item[ data.owner ]

  data.head = data.tail = null
  data.size = 0
  return owner

getHead = (owner) ->
  data = checkAttached owner
  return data.head

getTail = (owner) ->
  data = checkAttached owner
  return data.tail

getNext = (owner, item) ->
  data = checkAttached owner
  return item?[ data.next ]

getPrevious = (owner, item) ->
  data = checkAttached owner
  return item?[ data.prev ]

getSize = (owner) ->
  data = checkAttached owner
  return data.size

each = (owner, cb, ctx) ->
  data = checkAttached owner
  unless typeof cb is 'function'
    throw new TypeError 'LiLL.each method expects callback function'

  i = 0
  return i unless item = data.head

  iterator = if ctx isnt undefined
    func$withContext
  else
    func$noContext

  loop
    # storing next item now for cases where badly written
    # iterator function would modify the list
    next = item[ data.next ]
    iterator cb, item, i, ctx
    break unless item = next
    i += 1
  return i


find = (owner, predicate, ctx) ->
  data = checkAttached owner
  unless typeof predicate is 'function'
    throw new TypeError 'LiLL.find method expects predicate function'

  return null unless item = data.head

  func = if ctx isnt undefined
    func$withContext
  else
    func$noContext

  i = 0
  loop
    next = item[ data.next ]
    result = func predicate, item, i, ctx
    return item if result is true
    break unless item = next
    i += 1
  return null

func$noContext = (fn, item, i) ->
    fn item, i

func$withContext = (fn, item, i, ctx) ->
    fn.call ctx, item, i

isAttached = (owner) ->
  return owner[ bData ]?

checkAttached = (owner) ->
  return data if data = owner?[ bData ]
  throw new TypeError 'use LiLL.attach() method on owner object'

checkItem = (owner, item, method) ->
  unless item and typeof item in ['object', 'function']
    throw new TypeError "LiLL.#{method} needs an object or function to be added"
  unless Object.isExtensible item
    throw new TypeError "LiLL.#{method} method needs an extensible item"
  if item[ bOwner ] and item[ bOwner ] isnt owner
    throw new TypeError "LiLL cannot #{method} item that is managed by another list"

LiLL = {
  attach, detach
  add, has, remove, clear
  getHead, getTail
  getNext, getPrevious
  getSize, each, find
  isAttached
}

module.exports = Object.freeze LiLL
