chai = chai or require 'chai'
expect = chai.expect
sinon = require 'sinon'
chai.use require 'sinon-chai'

Lill = require '../src/lill'

describe 'Lill', ->

	it 'should be a object', ->
		expect(Lill).to.be.an "object"

	it 'should respond to attach method', ->
		expect(Lill).to.respondTo 'attach'

	describe 'attach()', ->

		it 'expects object in first argument argument', ->
			toThrow = (msg, fn) ->
				expect(fn).to.throw TypeError, /needs an object/, msg
			toThrow 'void', -> Lill.attach()
			toThrow 'null', -> Lill.attach null
			toThrow 'number', -> Lill.attach 1
			toThrow 'bool', -> Lill.attach false
			toThrow 'string', -> Lill.attach 'nothing'

		it 'expect passed object to be extensible', ->
			toThrow = (msg, fn) ->
				expect(fn).to.throw TypeError, /needs extensible object/, msg
			toThrow 'prevented', -> Lill.attach Object.preventExtensions({})
			toThrow 'sealed', -> Lill.attach Object.seal({})
			toThrow 'frozen', -> Lill.attach Object.freeze({})

		it 'forbids to use already attached object', ->
			attached = Lill.attach {}
			expect(-> Lill.attach attached).to.throw TypeError, /already attached/

	expectAttached = (fnName) ->
		expect(-> Lill[fnName]({})).to.throw TypeError, /attach/

	expectItem = (owner, fnName) ->
		toThrow = (msg, fn) ->
			expect(fn).to.throw TypeError, /needs an object or function/, msg
		toThrow 'void', -> Lill[fnName] owner
		toThrow 'null', -> Lill[fnName] owner, null
		toThrow 'number', -> Lill[fnName] owner, 1
		toThrow 'bool', -> Lill[fnName] owner, false
		toThrow 'string', -> Lill[fnName] owner, 'nothing'

		toThrow2 = (msg, fn) ->
			expect(fn).to.throw TypeError, /needs an extensible item/, msg
		toThrow2 'prevented', -> Lill[fnName] owner, Object.preventExtensions({})
		toThrow2 'sealed', -> Lill[fnName] owner, Object.seal({})
		toThrow2 'frozen', -> Lill[fnName] owner, Object.freeze({})

	beforeEach ->
		@owner = {}
		Lill.attach @owner
		@firstItem = {first: yes}
		@secondItem = {second: yes}
		@thirdItem = {third: yes}
		@add = (item) => Lill.add @owner, item
		@remove = (item) => Lill.remove @owner, item
		@head = => Lill.getHead @owner
		@tail = => Lill.getTail @owner
		@next = (item) => Lill.getNext @owner, item
		@prev = (item) => Lill.getPrevious @owner, item
		@size = => Lill.getSize @owner

	it 'should respond to add method', ->
		expect(Lill).to.respondTo 'add'

	describe 'add()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'add'

		it 'expects extensible object to add in second argument', ->
			expectItem @owner, 'add'

		it 'returns owner object', ->
			expect(@add @firstItem).to.equal @owner

		it 'ignores item that is already on list', ->
			@add @firstItem
			@add @firstItem
			expect(@size()).to.equal 1

		it 'allows to add item to multiple different lists', ->
			owner2 = Lill.attach {owner: 2}
			owner3 = Lill.attach {owner: 3}
			@add @firstItem
			Lill.add owner2, @firstItem
			Lill.add owner3, @firstItem
			expect(Lill.getSize @owner).to.equal 1
			expect(Lill.getHead owner2).to.equal @firstItem
			Lill.add owner3, @secondItem
			expect(Lill.getNext owner3, @firstItem).to.equal @secondItem

		it 'sets head to first added item', ->
			@add @firstItem
			expect(@head()).to.equal @firstItem

		it 'sets tail to last added item', ->
			@add @firstItem
			expect(@tail()).to.equal @firstItem
			@add @secondItem
			expect(@tail()).to.equal @secondItem
			@add @thirdItem
			expect(@tail()).to.equal @thirdItem

		it 'increases size for every unique item added', ->
			@add @firstItem
			expect(@size()).to.equal 1
			@add @secondItem
			expect(@size()).to.equal 2

		it 'sets next and previous of item to null for single item present', ->
			@add @firstItem
			expect(@next @firstItem).to.equal null
			expect(@prev @firstItem).to.equal null

		it 'sets next of item to following item', ->
			@add @firstItem
			@add @secondItem
			expect(@next @firstItem).to.equal @secondItem
			expect(@next @secondItem).to.equal null
			@add @thirdItem
			expect(@next @secondItem).to.equal @thirdItem
			expect(@next @thirdItem).to.equal null

		it 'sets prev of item to previous item', ->
			@add @firstItem
			@add @secondItem
			expect(@prev @firstItem).to.equal null
			expect(@prev @secondItem).to.equal @firstItem
			@add @thirdItem
			expect(@prev @thirdItem).to.equal @secondItem

	it 'should respond to has method', ->
		expect(Lill).to.respondTo 'has'

	describe 'has()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'has'

		it 'expects extensible object to check in second argument', ->
			expectItem @owner, 'has'

		it 'returns boolean to reflect if item is on the list', ->
			expect(Lill.has @owner, @firstItem).to.be.false
			@add @secondItem
			expect(Lill.has @owner, @secondItem).to.be.true

	it 'should respond to remove method', ->
		expect(Lill).to.respondTo 'remove'

	describe 'remove()', ->

		beforeEach ->
			@add @firstItem
			@add @secondItem
			@add @thirdItem

		it 'expects attached object in first argument', ->
			expectAttached 'remove'

		it 'expects extensible object to remove in second argument', ->
			expectItem @owner, 'remove'

		it 'returns owner object', ->
			expect(@remove @firstItem).to.equal @owner

		it 'silently ignores item that is on the list', ->
			@remove @firstItem
			@remove @firstItem
			expect(@size()).to.equal 2

		it 'sets head to next item when previous is removed', ->
			@remove @firstItem
			expect(@head()).to.equal @secondItem
			@remove @secondItem
			expect(@head()).to.equal @thirdItem
			@remove @thirdItem
			expect(@head()).to.equal null

		it 'sets tail to previous item when next one is removed', ->
			@remove @thirdItem
			expect(@tail()).to.equal @secondItem
			@remove @secondItem
			expect(@tail()).to.equal @firstItem
			@remove @firstItem
			expect(@tail()).to.equal null

		it 'decreases size for every removed item', ->
			expect(@size()).to.equal 3
			@remove @firstItem
			expect(@size()).to.equal 2
			@remove @secondItem
			expect(@size()).to.equal 1
			@remove @thirdItem
			expect(@size()).to.equal 0

		it 'removes next and prev from removed item', ->
			@remove @secondItem
			expect(@next @secondItem).to.not.be.ok
			expect(@prev @secondItem).to.not.be.ok

		it 'sets next of previous item to removed item\'s next', ->
			@add extraItem = {extra: yes}
			@remove @secondItem
			expect(@next @firstItem).to.equal @thirdItem
			@remove @thirdItem
			expect(@next @firstItem).to.equal extraItem

		it 'sets prev of next item to removed item\'s previous', ->
			@add extraItem = {extra: yes}
			@remove @thirdItem
			expect(@prev extraItem).to.equal @secondItem
			@remove @secondItem
			expect(@prev extraItem).to.equal @firstItem

	it 'should respond to getHead method', ->
		expect(Lill).to.respondTo 'getHead'

	describe 'getHead()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'getHead'

	it 'should respond to getTail method', ->
		expect(Lill).to.respondTo 'getTail'

	describe 'getTail()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'getTail'

	it 'should respond to getNext method', ->
		expect(Lill).to.respondTo 'getNext'

	describe 'getNext()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'getNext'

	it 'should respond to getPrevious method', ->
		expect(Lill).to.respondTo 'getPrevious'

	describe 'getPrevious()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'getPrevious'

	it 'should respond to each method', ->
		expect(Lill).to.respondTo 'each'

	describe 'each()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'each'

		it 'expects callback function in second argument', ->
			owner = @owner
			toThrow = (msg, fn) ->
				expect(fn).to.throw TypeError, /callback function/, msg
			toThrow 'void', -> Lill.each owner
			toThrow 'null', -> Lill.each owner, null
			toThrow 'number', -> Lill.each owner, 1
			toThrow 'bool', -> Lill.each owner, true
			toThrow 'string', -> Lill.each owner, 'nothing'
			toThrow 'string', -> Lill.each owner, {}
			toThrow 'string', -> Lill.each owner, []

		it 'callback is not called if list is empty', ->
			spy = sinon.spy()
			Lill.each @owner, spy
			expect(spy).to.not.have.been.called

		it 'calls callback for every item in the list in order', ->
			@add @firstItem
			@add @secondItem
			spy = sinon.spy()
			Lill.each @owner, spy
			expect(spy).to.have.been.calledTwice
			expect(spy.firstCall.args).to.eql [@firstItem, 0]
			expect(spy.secondCall.args).to.eql [@secondItem, 1]
			@add @thirdItem
			spy.reset()
			Lill.each @owner, spy
			expect(spy.thirdCall.args).to.eql [@thirdItem, 2]

		it 'optionally accepts third argument being context for the callback function', ->
			@add @firstItem
			spy = sinon.spy()
			Lill.each @owner, spy, ctx = {}
			expect(spy).to.be.calledOn ctx

	it 'should respond to getSize method', ->
		expect(Lill).to.respondTo 'getSize'

	describe 'getSize()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'getSize'

		it 'returns number of items in the list', ->
			expect(Lill.getSize @owner).to.equal 0

	it 'should respond to clear method', ->
		expect(Lill).to.respondTo 'clear'

	describe 'clear()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'clear'

		it 'removes all items from the list', ->
			@add @firstItem
			@add @thirdItem
			@add @secondItem
			Lill.clear @owner
			expect(@size()).to.equal 0
			expect(Lill.has @owner, @secondItem).to.be.false
			expect(@head()).to.not.be.ok

	it 'should respond to detach method', ->
		expect(Lill).to.respondTo 'detach'

	describe 'detach()', ->

		it 'ignores object that attached', ->
			expect(-> Lill.detach {}).to.not.throw

		it 'allows to attach owner object again', ->
			Lill.detach @owner
			Lill.attach @owner

	it 'should respond to isAttached method', ->
		expect(Lill).to.respondTo 'isAttached'

	describe 'isAttached()', ->

		it 'returns true for object attached by Lill', ->
			obj = Lill.attach {}
			expect(Lill.isAttached obj).to.be.true

		it 'returns false for object not attached by Lill', ->
			obj = {}
			expect(Lill.isAttached obj).to.be.false
