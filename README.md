# LiLL - Light Linked List

*Lightweight linked list implementation with small memory footprint.*

[![Build Status](https://travis-ci.org/BlackDice/lill.svg)](https://travis-ci.org/BlackDice/lill)[![Dependencies status](https://david-dm.org/BlackDice/lill/status.svg)](https://david-dm.org/BlackDice/lill#info=dependencies)[![devDependency Status](https://david-dm.org/BlackDice/lill/dev-status.svg)](https://david-dm.org/BlackDice/lill#info=devDependencies)

[![NPM](https://nodei.co/npm/lill.png)](https://nodei.co/npm/lill/)

There are few implementation of the [linked-list structure](http://en.wikipedia.org/wiki/Linked_list), but most of them creates bunch of extra objects to store the information. We didn't like that so *LiLL* has been made.

Linked list structure shines in situations when you need to iterate over some list very frequently while modifications of the list are not that frequent. Items of such list are simple linked together by referencing each other. This is much faster to iterate over than standard loops.

## Using Symbol

LiLL is using new ES6 feature called [Symbols](http://tc39wiki.calculist.org/es6/symbols/). That way everything can be stored on original objects that are supposed to be linked together. Thanks to the Symbol there are no collisions in property names and it doesn't interfere with your objects in any way. You can see this library as **proof-of-concept** of how can new Symbol be used.

### Warning about Symbol

Please note, that Symbol is not officially supported by most of the environments so we had to use shim. Currently the [es6-symbol](https://www.npmjs.org/package/es6-symbol) implementation was chosen. If you know about better one, feel free to send in pull request. This is also only runtime dependency. Hopefully it will not be needed one day ;)

There is one limitation coming from using shim thou. Symbols are still added as standard properties using string identifier. Therefore calling for example `Object.getOwnPropertyNames` will return properties made by Symbol. That's clearly against specification, but we do believe, there is no clean way how to overcome this. We recommend to use LiLL just for objects that are not inspected on their properties.

## Installation

For the NodeJS environment simply run:

	npm install lill

If you are using Bower then run:

	bower install lill

The `lib` folder contains various files:

 * lill.js - plain JS compiled from source coffee file
 * lill.min.js - same as above just minified
 * lill-browser.js - browserified bundle packed with dependencies
 * lill-browser.min.js - minified version of the above file

## How to use LiLL

First you need container object, We call it *owner*. It can be anything that is recognized as *object* or *function* by `typeof` operator (except *null* of course). On top of that, *owner* has to pass the check by `Object.isExtensible()`.

	var Lill = require 'lill'
	var owner = {}
	Lill.attach(owner) === owner

LiLL is designed to not create any state objects. Small disadvantage of such solution is that you have to pass *owner* object to every operation method.

### Adding to the list

To keep the memory footprint low, information about neighbors are stored on added item using Symbols. That means you can add only items capable of this. No primitive values allows that. You can use objects and functions.

	var item = foo: 'bar'
	Lill.add owner, item

### Removing from the list

This works very similar to adding. Previously added properties are completely removed from the item and neighbors are modified accordingly.

	Lill.remove owner, item

### Iterating the list

Currently only basic iteration is supported and looks like this.

	iterate = (item, i) ->
		# do your work with item

	Lill.each owner, iterate, optionalContext

There is also internal counter of the items currently on the list. This can be used for example to randomly pick item from the list.

	Lill.getSize owner

### Accessing the items

Every items on the list keeps information about it's neighbors. You can access these informations like this.

	Lill.getNext owner, item
	Lill.getPrevious owner, item

You might want to know where the list begins too. This works very similar.

	Lill.getHead owner
	Lill.getTail owner

Now you could iterate the list like this.

	item = Lill.getHead owner
	while item
		# do your work with the item
		item = Lill.getNext owner, item

### Clearing the list

To conveniently clear the list, just call the following.

	Lill.clear owner

### Detach the list

If you want remove all items from the list and pretty much dispose everything that LiLL was using, do it like this.

	Lill.detach owner

Detached object can be later attached again if you like. If you use any of the operation methods on detached object, error will be thrown.

### Check for attached object

If you want to check if some object is used as owner by Lill, simply call this.

	Lill.isAttached owner

## Known limitation

Due to simplicity of the solution, single object can be "owner" only once. Item can be present in multiple lists without influencing each other.

## Tests

LiLL is fully tested. You can check out the result of the tests at [Travis CI](https://travis-ci.org/BlackDice/lill) or clone repository for yourself, run `npm install` first and then `npm test`.
