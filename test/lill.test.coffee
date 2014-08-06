chai = chai or require 'chai'
expect = chai.expect
sinon = require 'sinon'
chai.use require 'sinon-chai'

Lill = require '../src/lill'
{sNext, sPrev} = Lill

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
			toThrow 'bool', -> Lill.attach true
			toThrow 'string', -> Lill.attach 'nothing'

		it 'expect passed object to be extensible', ->
			toThrow = (msg, fn) -> 
				expect(fn).to.throw TypeError, /needs extensible object/, msg
			toThrow 'prevented', -> Lill.attach Object.preventExtensions({})
			toThrow 'sealed', -> Lill.attach Object.seal({})
			toThrow 'frozen', -> Lill.attach Object.freeze({})

	expectAttached = (fnName) ->
		expect(-> Lill[fnName]({})).to.throw TypeError, /attach/

	expectItem = (owner, fnName) ->
		toThrow = (msg, fn) -> 
			expect(fn).to.throw TypeError, /needs an extensible item/, msg
		toThrow 'void', -> Lill[fnName] owner
		toThrow 'null', -> Lill[fnName] owner, null
		toThrow 'number', -> Lill[fnName] owner, 1
		toThrow 'bool', -> Lill[fnName] owner, true
		toThrow 'string', -> Lill[fnName] owner, 'nothing'
		toThrow 'prevented', -> Lill[fnName] owner, Object.preventExtensions({})
		toThrow 'sealed', -> Lill[fnName] owner, Object.seal({})
		toThrow 'frozen', -> Lill[fnName] owner, Object.freeze({})

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

		it 'throws error if item is already on different list', ->
			@add item = @firstItem
			badOwner = {}
			Lill.attach badOwner
			expect(-> Lill.add badOwner, item).to.throw Error, /managed by another list/

		it 'silently ignores item that is already on list', ->
			@add @firstItem
			@add @firstItem
			expect(@size()).to.equal 1

		it 'sets head and tail to first attached item', ->
			@add @firstItem 
			expect(@head()).to.equal @firstItem
			expect(@tail()).to.equal @firstItem

		it 'sets head to first added item', ->
			@add @firstItem
			expect(@head()).to.equal @firstItem

		it 'sets tail to last added item', ->
			@add @firstItem
			@add @secondItem
			expect(@tail()).to.equal @secondItem
			@add @thirdItem
			expect(@tail()).to.equal @thirdItem

		it 'increases size for every unique item added', ->
			@add @firstItem
			expect(@size()).to.equal 1
			@add @secondItem
			expect(@size()).to.equal 2

		it 'sets @@next and @@prev properties to null when only single item added', ->
			@add @firstItem
			expect(@firstItem[ sNext ]).to.equal null
			expect(@firstItem[ sPrev ]).to.equal null

		it 'sets @@next property to following item', ->
			@add @firstItem
			@add @secondItem
			expect(@firstItem[ sNext ]).to.equal @secondItem
			expect(@secondItem[ sNext ]).to.equal null
			@add @thirdItem
			expect(@secondItem[ sNext ]).to.equal @thirdItem
			expect(@thirdItem[ sNext ]).to.equal null

		it 'sets @@prev property to previous item', ->
			@add @firstItem
			@add @secondItem
			expect(@firstItem[ sPrev ]).to.equal null
			expect(@secondItem[ sPrev ]).to.equal @firstItem
			@add @thirdItem
			expect(@thirdItem[ sPrev ]).to.equal @secondItem	

	it 'should respond to remove method', ->
		expect(Lill).to.respondTo 'remove'

	describe 'remove()', ->

		beforeEach ->
			@add @firstItem
			@add @secondItem
			@add @thirdItem

		it 'expects attached object in first argument', ->
			expectAttached 'remove'

		it 'expects extensible object to add in second argument', ->
			expectItem @owner, 'remove'

		it 'returns owner object', ->
			expect(@remove @firstItem).to.equal @owner

		it 'throws error if item is already on different list', ->
			@add item = @firstItem
			badOwner = {}
			Lill.attach badOwner
			expect(-> Lill.add badOwner, item).to.throw Error, /managed by another list/

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

		it 'removes @@next and @@prev properties of removed item', ->
			@remove @secondItem
			expect(@secondItem[ sNext ]).to.not.be.ok
			expect(@secondItem[ sPrev ]).to.not.be.ok

		it 'sets @@next property of previous item to removed item\'s next', ->
			@add extraItem = {extra: yes}
			@remove @secondItem
			expect(@firstItem[ sNext ]).to.equal @thirdItem
			@remove @thirdItem
			expect(@firstItem[ sNext ]).to.equal extraItem

		it 'sets @@prev property of next item to removed item\'s previous', ->
			@add extraItem = {extra: yes}
			@remove @thirdItem
			expect(extraItem[ sPrev ]).to.equal @secondItem
			@remove @secondItem
			expect(extraItem[ sPrev ]).to.equal @firstItem

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

	it 'should respond to detach method', ->
		expect(Lill).to.respondTo 'detach'

	describe 'detach()', ->

		it 'expects attached object in first argument', ->
			expectAttached 'detach'

		it 'should remove all items from the list', ->
			@add @firstItem
			@add @secondItem
			Lill.detach @owner
			expect(@firstItem[ sNext ]).to.not.be.ok
			expect(@firstItem[ sPrev ]).to.not.be.ok
			expect(@secondItem[ sNext ]).to.not.be.ok
			expect(@secondItem[ sPrev ]).to.not.be.ok
