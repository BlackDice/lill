'use strict'

Symbol = require 'es6-symbol'

sData = Symbol 'linked list related data'
sOwner = Symbol 'owner of the item'

attach = (owner) ->
  unless owner and typeof owner in ['object', 'function']
    throw new TypeError 'LiLL.attach needs an object or function'
  if owner[ sData ]
    throw new TypeError 'LiLL.attach cannot use already attached object'
  unless Object.isExtensible owner
    throw new TypeError 'LiLL.attach needs extensible object'

  owner[ sData ] = data =
    id: Symbol 'identity of the list'
    next: Symbol 'next item in linked list'
    prev: Symbol 'previous item in linked list'
    head: null
    tail: null
    size: 0

  Object.seal data
  return owner

detach = (owner) ->
  data = checkAttached owner
  clear owner
  delete owner[ sData ]
  return owner

add = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'add'

  return owner if item[ data.id ] is owner

  item[ data.next ] = item[ data.prev ] = null
  item[ data.id ] = owner

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

  return item[ data.id ] is owner

remove = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'remove'

  return owner unless item[ data.id ] is owner

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
  delete item[ data.id ]

  data.size -= 1
  return owner

clear = (owner) ->
  data = checkAttached owner
  while item = data.head
    data.head = item[ data.next ]
    delete item[ data.next ]
    delete item[ data.prev ]
    delete item[ data.id ]

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
  return unless item = data.head

  i = 0
  ctx or= cb
  loop
    cb.call ctx, item, i++
    item = item[ data.next ]
    break unless item

checkAttached = (owner) ->
  return data if data = owner?[ sData ]
  throw new TypeError 'use LiLL.attach() method on owner object'

checkItem = (owner, item, method) ->
  unless item and typeof item in ['object', 'function']
    throw new TypeError "LiLL.#{method} needs an object or function to be added"
  unless Object.isExtensible item
    throw new TypeError "LiLL.#{method} method needs an extensible item"
  if item[ sOwner ] and item[ sOwner ] isnt owner
    throw new TypeError "LiLL cannot #{method} item that is managed by another list"

LiLL = {
  attach, detach
  add, has, remove, clear
  getHead, getTail
  getNext, getPrevious
  getSize, each
}

module.exports = Object.freeze LiLL
