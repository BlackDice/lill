'use strict'

Symbol = require 'es6-symbol'

sData = Symbol 'linked list related data'
sHead = Symbol 'reference to start of the list'
sTail = Symbol 'reference to end of the list'
sSize = Symbol 'counter of items in the list'
sNext = Symbol 'next item in linked list'
sPrev = Symbol 'previous item in linked list'
sOwner = Symbol 'owner of the item'

attach = (owner) ->
  unless owner and typeof owner in ['object', 'function']
    throw new TypeError 'LiLL.attach needs an object or function'
  unless Object.isExtensible owner
    throw new TypeError 'LiLL.attach needs extensible object'

  owner[ sData ] = data = Object.create null
  data[ sHead ] = null
  data[ sTail ] = null
  data[ sSize ] = 0

  return owner

detach = (owner) ->
  data = checkAttached owner
  while item = data[ sHead ]
    data[ sHead ] = item[ sNext ]
    delete item[ sNext ]
    delete item[ sPrev ]
    delete item[ sOwner ]

  delete owner[ sData ]
  return owner

add = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'add'

  return owner if item[ sOwner ]

  item[ sNext ] = item[ sPrev ] = null
  item[ sOwner ] = owner

  unless data[ sHead ]
    data[ sHead ] = data[ sTail ] = item
  else
    # Current last item points to added item
    data[ sTail ][ sNext ] = item
    # Added item points to the current tail
    item[ sPrev ] = data[ sTail ]
    # Tail point to added item
    data[ sTail ] = item

  data[ sSize ] += 1
  return owner

remove = (owner, item) ->
  data = checkAttached owner
  checkItem owner, item, 'remove'

  return owner unless item[ sOwner ]

  # Shift head since the current is being removed
  if data[ sHead ] is item
    data[ sHead ] = data[ sHead ][ sNext ]

  # Shift tail since the current is being removed
  if data[ sTail ] is item
    data[ sTail ] = data[ sTail ][ sPrev ]

  # Update neighbors
  prev[ sNext ] = item[ sNext ] if prev = item[ sPrev ]
  next[ sPrev ] = item[ sPrev ] if next = item[ sNext ]

  # Cleanup of removed item
  delete item[ sNext ]
  delete item[ sPrev ]
  delete item[ sOwner ]

  data[ sSize ] -= 1
  return owner

getHead = (owner) ->
  data = checkAttached owner
  return data[ sHead ]

getTail = (owner) ->
  data = checkAttached owner
  return data[ sTail ]

getSize = (owner) ->
  data = checkAttached owner
  return data[ sSize ]

each = (owner, cb, ctx) ->
  data = checkAttached owner
  unless typeof cb is 'function'
    throw new TypeError 'LiLL.each method expects callback function'
  return unless item = data[ sHead ]

  i = 0
  ctx or= cb
  loop
    cb.call ctx, item, i++
    item = item[ sNext ]
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

LiLL = {attach, detach, add, remove, getHead, getTail, getSize, each}
LiLL.sNext = sNext
LiLL.sPrev = sPrev
Object.freeze LiLL

module.exports = LiLL
