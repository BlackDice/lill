# LiLL - Light Linked List

*Lightweight linked list implementation with a small memory footprint.*

[![Build Status](https://travis-ci.org/BlackDice/lill.svg)](https://travis-ci.org/BlackDice/lill)[![Dependencies status](https://david-dm.org/BlackDice/lill/status.svg)](https://david-dm.org/BlackDice/lill#info=dependencies)[![devDependency Status](https://david-dm.org/BlackDice/lill/dev-status.svg)](https://david-dm.org/BlackDice/lill#info=devDependencies)

[![NPM](https://nodei.co/npm/lill.png)](https://nodei.co/npm/lill/)

There are few implementation of the [linked-list structure](http://en.wikipedia.org/wiki/Linked_list) in the JavaScript ecosystem, but most of them create a bunch of extra objects to store metadata about the list. We didn't liked that, so we created *LiLL*.

The linked list data structure really shines in situations when you frequently need to iterate over a list of items, but only modify the list's structure infrequently. Linked lists are ordered simply by having each object in the list reference its previous and next siblings. Linked lists are much faster to iterate over than standard loops.

## Built With Symbol

LiLL is using new ES6/ES2015 feature called [Symbol](http://tc39wiki.calculist.org/es6/symbols/). This primitive makes it possible to store the linked list's metadata on original objects being linked together. There are no collisions in property names and it doesn't interfere with your objects in any way. You can see this library as **proof-of-concept** of how can new *Symbol* be used.

## Installation

### Node.js

To use LiLL in a Node environment simply run:

```bash
npm install -S lill
```

and `require('lill')` in your application. This file is built using [BabelJS](http://babeljs.io/) to make code compatible with ES5 environment. For use in ES6 environment you can use `require('lill/es6')`.

### Browser

The `dist` folder [in the repository](https://github.com/BlackDice/lill/tree/master/dist) contains these files:

 * lill.js - UMD bundle for direct use in a browser with dependencies
 * lill.min.js - same as above just minified
 * lill-min.js.map - optional source map for minified file

## How to use LiLL

First you need container object, We call it *owner*. It can be anything that is recognized as *object* or *function* by `typeof` operator (except *null* of course). On top of that, *owner* has to pass the check by `Object.isExtensible()`.

```js
var Lill = require('lill');
var owner = {};
Lill.attach(owner) === owner;
```

LiLL creates only single state object that is stored on the *owner* using Symbol. Basically it means that LiLL's public API is completely stateless. One small disadvantage this approach is that you must pass an *owner* object to every LiLL method call.

### Adding to the list

To keep the memory footprint low, information about neighbors are stored on actual items using Symbols. That means you can add only items capable of this. No primitive values allows that. Similarly to *owner*, you can use *objects* or *functions* and item has to pass the check for `Object.isExtensible()`.

```js
var item = { foo: 'bar' };
Lill.add(owner, item);
```
	
### Removing from the list

This works very similar to adding. Previously added properties are completely removed from the item and neighbors are modified accordingly.

```js
Lill.remove(owner, item);
```

### Iterating the list

Currently only basic iteration is supported and looks like this.

```js
var iterate = function (item, i) {
	// do your work with item
};

Lill.each(owner, iterate, optionalContext);
```

Be warned that you should **not modify the list** during iterator invocation as it may cause unexpected behavior. This comes from nature of linked list structure as any changes in the chain of items could break iteration.

### Finding item in the list ###

If you are looking for a particular item, using each means that it will iterate over every item. Using `find` quits the loop once the predicate function returns `true`. If no predicate is fulfilled, the `null` is returned.

```js
	var predicate = function (item, i) {
		if (item.name == "correct") {
			return true;
		}
	};
	
	item = Lill.find(owner, predicate, optionalContext);
	item.name == "correct" // true
```

### Number of items in list

There is internal counter of the items currently on the list. This can be used for example to randomly pick item from the list.

```js
Lill.getSize(owner);
```

### Accessing the items

Every item on the list keeps information about it's neighbors. You can access such informations like this.

```js
Lill.getNext(owner, item);
Lill.getPrevious(owner, item);
```

You might want to know where the list begins too. This works very similar.

```js
Lill.getHead(owner);
Lill.getTail(owner);
```

Now you could iterate the list like this.

```js
var item = Lill.getHead(owner);
while (item) {
	// do your work with the item
	item = Lill.getNext(owner, item);
}
```

### Clearing the list

To conveniently remove all items from the list, just call the following.

```js
Lill.clear(owner);
```

### Detach the list

If you want remove all items from the list and dispose of everything that LiLL was using, simply call `detach`.

```js
Lill.detach(owner);
```

A detached object can be reattached later if necessary. If you use any of LiLL's operation methods on a detached object an error will be thrown.

### Check for attached object

If you want to check if some object is used as owner by LiLL, simply call this.

```js
Lill.isAttached(owner);
```

## Known limitation

Due to simplicity of the solution, single object can be "owner" only once. However item can be present **in multiple lists** without influencing each other.

## Tests

LiLL is fully tested. You can check out the result of the tests at [Travis CI](https://travis-ci.org/BlackDice/lill) or clone repository for yourself, run `npm install` first and then `npm test`.
