# LiLL - Light Linked List

*Lightweight linked list implementation with small memory footprint.*

[![Build Status](https://travis-ci.org/BlackDice/lill.svg)](https://travis-ci.org/BlackDice/lill)[![Dependencies status](https://david-dm.org/BlackDice/lill/status.svg)](https://david-dm.org/BlackDice/lill#info=dependencies)[![devDependency Status](https://david-dm.org/BlackDice/lill/dev-status.svg)](https://david-dm.org/BlackDice/lill#info=devDependencies)

[![NPM](https://nodei.co/npm/lill.png)](https://nodei.co/npm/lill/)

There are few implementation of the [linked-list structure](http://en.wikipedia.org/wiki/Linked_list), but most of them creates bunch of extra objects to store the information. I didn't like that so *LiLL* has been made.

Linked list structure shines in situations when you need to iterate many objects very frequently while modifications of the list are not that frequent. One of the great use cases is in entity based systems used in game development.

## Using Symbol

LiLL is using new ES6 feature called [Symbols](http://tc39wiki.calculist.org/es6/symbols/). That way everything can be stored on original objects that are supposed to be linked together. Thanks to the Symbol there are no collisions in property names and it doesn't interfere with your objects in any way. You can see this library as **proof-of-concept** of how can new Symbol be used.

### Warning about Symbol

Please note, that Symbol is not officially supported by most of the environments so I had to use shim. I've chosen [es6-symbol](https://www.npmjs.org/package/es6-symbol) implementation. If you know about better one, feel free to send in pull request. This is also only runtime dependency. Hopefully it will not be needed one day ;)

There is one limitation coming from using shim thou. Symbols are still added as standard properties using string identifier. Therefore calling for example `Object.getOwnPropertyNames` will return properties made by Symbol. That's clearly against specification, but I do believe, there is no clean way how to overcome this.

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

First you need container object, I call it *owner*. It can be anything that is recognized as `object` or `function` by `typeof` operator (except `null` of course). Object has to pass the check by `Object.isExtensible()` too.

	var Lill = require('lill')
	var owner = {}
	Lill.attach(owner) === owner

LiLL is designed to not create any state objects. Small disadvantage of such solution is that you have to pass owner object to every operation method.

### Adding to the list

To keep the memory footprint low, information about neighbors are stored on added item using Symbols. That means you can add only items capable of this. No primitive values allows that. You can use objects and functions.

	var item = {foo: "bar"}
	Lill.add(owner, item)

### Removing from the list

This works very similar to adding. Previously added properties are completely removed from the item and neighbors are modified accordingly.

	Lill.remove(owner, item)

### Accessing the list

Currently list supports only basic iteration, but this can be easily expanded and I am planning to do it in form of simple plugin system.

Basically all added items keeps information about it's neighbors. You can access these information easily using public symbols. Note that values of these properties are not protected in any way and if you modify them, the list is practically broken.

	item[ Lill.sNext ]
	item[ Lill.sPrev ]

This is hardly enough. You probably want to know where the list begins or eventually where it ends. For this you have read-only access to so called head and tail.

	Lill.getHead(owner)
	Lill.getTail(owner)

Now you could iterate the list very easily like this

	var item = Lill.getHead(owner)
	while (item) {
		// do your work with the item
		item = item[ sNext ]
	}

If you want more convenient way or maybe separate logic to the function, LiLL contains one easy to use method for this with little added bonus in form of 0-based index of item in the list.

	function iterate(item, i) {
		// do your work with item
	}

	Lill.each(owner, iterate, optionalContext)

Finally there is also internal counter of the items currently on the list.

	Lill.getSize(owner)

### Detach the list

If you want to free up all resources used by LiLL connected to one owner, simply call `Lill.detach(owner)`.

## Known limitation

Due to simplicity of the solution, single object can be "owner" only once. Similarly all items added to the list cannot be part of another linked list.

## Tests

LiLL is fully tested. You can check out the result of the tests at [Travis CI](https://travis-ci.org/BlackDice/lill) or clone repository for yourself, run `npm install` first and then `npm test`.
