import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

import Lill from '../src/lill';

describe('Lill', function() {

  it('should be a object', function() {
    expect(Lill).to.be.an("object");
  });

  it('should respond to attach method', function() {
    expect(Lill).to.respondTo('attach');
  });

  describe('attach()', function() {

    it('expects object in first argument argument', function() {
      function toThrow(msg, fn) {
        expect(fn).to.throw(TypeError, /object or function/, msg);
      };

      toThrow('void', () => Lill.attach());
      toThrow('null', () => Lill.attach(null));
      toThrow('number', () => Lill.attach(1));
      toThrow('bool', () => Lill.attach(false));
      toThrow('string', () => Lill.attach('nothing'));
    });

    it('expect passed object to be extensible', function() {
      function toThrow(msg, fn) {
        expect(fn).to.throw(TypeError, /needs an extensible/, msg);
      };

      toThrow('prevented', () => Lill.attach(Object.preventExtensions({})));
      toThrow('sealed', () => Lill.attach(Object.seal({})));
      toThrow('frozen', () => Lill.attach(Object.freeze({})));
    });

    it('forbids to use already attached object', function() {
      var attached = Lill.attach({});
      expect(function() {
        Lill.attach(attached);
      }).to.throw(TypeError, /already attached/);
    });
  });

  function expectAttached(fnName) {
    expect(function() {
      Lill[fnName]({});
    }).to.throw(TypeError, /attach/);
  };

  function expectItem(owner, fnName) {
    function toThrow(msg, fn) {
      expect(fn).to.throw(TypeError, /object or function/, msg);
    };

    toThrow('void', () => Lill[fnName](owner));
    toThrow('null', () => Lill[fnName](owner, null));
    toThrow('number', () => Lill[fnName](owner, 1));
    toThrow('bool', () => Lill[fnName](owner, false));
    toThrow('string', () => Lill[fnName](owner, 'nothing'));

    function toThrow2(msg, fn) {
      expect(fn).to.throw(TypeError, /needs an extensible/, msg);
    };

    toThrow2('prevented', () => Lill[fnName](owner, Object.preventExtensions({})));
    toThrow2('sealed', () => Lill[fnName](owner, Object.seal({})));
    toThrow2('frozen', () => Lill[fnName](owner, Object.freeze({})));
  };

  beforeEach(function() {
    this.owner = {};
    Lill.attach(this.owner);

    this.firstItem = { first: true };
    this.secondItem = { second: true };
    this.thirdItem = { third: true };

    this.add = (item) => Lill.add(this.owner, item);
    this.remove = (item) => Lill.remove(this.owner, item);
    this.head = () => Lill.getHead(this.owner);
    this.tail = () => Lill.getTail(this.owner);
    this.next = (item) => Lill.getNext(this.owner, item);
    this.prev = (item) => Lill.getPrevious(this.owner, item);
    this.size = () => Lill.getSize(this.owner);
  });

  it('should respond to add method', function() {
    expect(Lill).to.respondTo('add');
  });

  describe('add()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('add');
    });

    it('expects extensible object to add in second argument', function() {
      expectItem(this.owner, 'add');
    });

    it('returns owner object', function() {
      expect(this.add(this.firstItem)).to.equal(this.owner);
    });

    it('ignores item that is already on list', function() {
      this.add(this.firstItem);
      this.add(this.firstItem);
      expect(this.size()).to.equal(1);
    });

    it('allows to add item to multiple different lists', function() {
      var owner2, owner3;
      owner2 = Lill.attach({ owner: 2 });
      owner3 = Lill.attach({ owner: 3 });

      this.add(this.firstItem);
      Lill.add(owner2, this.firstItem);
      Lill.add(owner3, this.firstItem);

      expect(Lill.getSize(this.owner)).to.equal(1);
      expect(Lill.getHead(owner2)).to.equal(this.firstItem);
      Lill.add(owner3, this.secondItem);
      expect(Lill.getNext(owner3, this.firstItem)).to.equal(this.secondItem);
    });

    it('sets head to first added item', function() {
      this.add(this.firstItem);
      expect(this.head()).to.equal(this.firstItem);
    });

    it('sets tail to last added item', function() {
      this.add(this.firstItem);
      expect(this.tail()).to.equal(this.firstItem);
      this.add(this.secondItem);
      expect(this.tail()).to.equal(this.secondItem);
      this.add(this.thirdItem);
      expect(this.tail()).to.equal(this.thirdItem);
    });

    it('increases size for every unique item added', function() {
      this.add(this.firstItem);
      expect(this.size()).to.equal(1);
      this.add(this.secondItem);
      expect(this.size()).to.equal(2);
    });

    it('sets next and previous of item to null for single item present', function() {
      this.add(this.firstItem);
      expect(this.next(this.firstItem)).to.equal(null);
      expect(this.prev(this.firstItem)).to.equal(null);
    });

    it('sets next of item to following item', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      expect(this.next(this.firstItem)).to.equal(this.secondItem);
      expect(this.next(this.secondItem)).to.equal(null);
      this.add(this.thirdItem);
      expect(this.next(this.secondItem)).to.equal(this.thirdItem);
      expect(this.next(this.thirdItem)).to.equal(null);
    });

    it('sets prev of item to previous item', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      expect(this.prev(this.firstItem)).to.equal(null);
      expect(this.prev(this.secondItem)).to.equal(this.firstItem);
      this.add(this.thirdItem);
      expect(this.prev(this.thirdItem)).to.equal(this.secondItem);
    });
  });

  it('should respond to has method', function() {
    expect(Lill).to.respondTo('has');
  });

  describe('has()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('has');
    });

    it('expects extensible object to check in second argument', function() {
      expectItem(this.owner, 'has');
    });

    it('returns boolean to reflect if item is on the list', function() {
      expect(Lill.has(this.owner, this.firstItem)).to.be["false"];
      this.add(this.secondItem);
      expect(Lill.has(this.owner, this.secondItem)).to.be["true"];
    });
  });

  it('should respond to remove method', function() {
    expect(Lill).to.respondTo('remove');
  });

  describe('remove()', function() {

    beforeEach(function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
    });

    it('expects attached object in first argument', function() {
      expectAttached('remove');
    });

    it('expects extensible object to remove in second argument', function() {
      expectItem(this.owner, 'remove');
    });

    it('returns owner object', function() {
      expect(this.remove(this.firstItem)).to.equal(this.owner);
    });

    it('silently ignores item that is on the list', function() {
      this.remove(this.firstItem);
      this.remove(this.firstItem);
      expect(this.size()).to.equal(2);
    });

    it('sets head to next item when previous is removed', function() {
      this.remove(this.firstItem);
      expect(this.head()).to.equal(this.secondItem);
      this.remove(this.secondItem);
      expect(this.head()).to.equal(this.thirdItem);
      this.remove(this.thirdItem);
      expect(this.head()).to.equal(null);
    });

    it('sets tail to previous item when next one is removed', function() {
      this.remove(this.thirdItem);
      expect(this.tail()).to.equal(this.secondItem);
      this.remove(this.secondItem);
      expect(this.tail()).to.equal(this.firstItem);
      this.remove(this.firstItem);
      expect(this.tail()).to.equal(null);
    });

    it('decreases size for every removed item', function() {
      expect(this.size()).to.equal(3);
      this.remove(this.firstItem);
      expect(this.size()).to.equal(2);
      this.remove(this.secondItem);
      expect(this.size()).to.equal(1);
      this.remove(this.thirdItem);
      expect(this.size()).to.equal(0);
    });

    it('removes next and prev from removed item', function() {
      this.remove(this.secondItem);
      expect(this.next(this.secondItem)).to.not.be.ok;
      expect(this.prev(this.secondItem)).to.not.be.ok;
    });

    it('sets next of previous item to removed item\'s next', function() {
      const extraItem = { extra: true };
      this.add(extraItem);
      this.remove(this.secondItem);
      expect(this.next(this.firstItem)).to.equal(this.thirdItem);
      this.remove(this.thirdItem);
      expect(this.next(this.firstItem)).to.equal(extraItem);
    });

    it('sets prev of next item to removed item\'s previous', function() {
      const extraItem = { extra: true };
      this.add(extraItem);
      this.remove(this.thirdItem);
      expect(this.prev(extraItem)).to.equal(this.secondItem);
      this.remove(this.secondItem);
      expect(this.prev(extraItem)).to.equal(this.firstItem);
    });
  });

  it('should respond to getHead method', function() {
    expect(Lill).to.respondTo('getHead');
  });

  describe('getHead()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('getHead');
    });

  });

  it('should respond to getTail method', function() {
    expect(Lill).to.respondTo('getTail');
  });

  describe('getTail()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('getTail');
    });

  });

  it('should respond to getNext method', function() {
    expect(Lill).to.respondTo('getNext');
  });

  describe('getNext()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('getNext');
    });

  });

  it('should respond to getPrevious method', function() {
    expect(Lill).to.respondTo('getPrevious');
  });

  describe('getPrevious()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('getPrevious');
    });

  });

  it('should respond to each method', function() {
    expect(Lill).to.respondTo('each');
  });

  describe('each()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('each');
    });

    it('expects callback function in second argument', function() {
      const owner = this.owner;

      function toThrow(msg, fn) {
        expect(fn).to.throw(TypeError, /callback function/, msg);
      };

      toThrow('void', () => Lill.each(owner));
      toThrow('null', () => Lill.each(owner, null));
      toThrow('number', () => Lill.each(owner, 1));
      toThrow('bool', () => Lill.each(owner, true));
      toThrow('string', () => Lill.each(owner, 'nothing'));
      toThrow('string', () => Lill.each(owner, {}));
      toThrow('string', () => Lill.each(owner, []));
    });

    it('callback is not called if list is empty', function() {
      var spy = sinon.spy();
      Lill.each(this.owner, spy);
      expect(spy).to.not.have.been.called;
    });

    it('calls callback for every item in the list in order', function() {
      const spy = sinon.spy();
      this.add(this.firstItem);
      this.add(this.secondItem);
      Lill.each(this.owner, spy);
      expect(spy).to.have.been.calledTwice;
      expect(spy.firstCall.args).to.eql([this.firstItem, 0]);
      expect(spy.secondCall.args).to.eql([this.secondItem, 1]);
      this.add(this.thirdItem);
      spy.reset();
      Lill.each(this.owner, spy);
      expect(spy.thirdCall.args).to.eql([this.thirdItem, 2]);
    });

    it('avoids iterating items if list is changed during iteration', function() {
      let called = 0;
      this.add(this.firstItem);
      Lill.each(this.owner, () => {
        called += 1;
        this.add(this.secondItem);
      });
      expect(called).to.equal(1);
    });

    it('optionally accepts third argument being context for the callback function', function() {
      const spy = sinon.spy();
      const ctx = {};
      this.add(this.firstItem);
      Lill.each(this.owner, spy, ctx);
      expect(spy).to.be.calledOn(ctx);
    });
  });

  it('should respond to find method', function() {
    expect(Lill).to.respondTo('find');
  });

  describe('find()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('find');
    });

    it('expects predicate function in second argument', function() {
      const owner = this.owner;
      function toThrow(msg, fn) {
        expect(fn).to.throw(TypeError, /predicate function/, msg);
      };

      toThrow('void', () => Lill.find(owner));
      toThrow('null', () => Lill.find(owner, null));
      toThrow('number', () => Lill.find(owner, 1));
      toThrow('bool', () => Lill.find(owner, true));
      toThrow('string', () => Lill.find(owner, 'nothing'));
      toThrow('string', () => Lill.find(owner, {}));
      toThrow('string', () => Lill.find(owner, []));
    });

    it('predicate is not called if list is empty', function() {
      var spy = sinon.spy();
      Lill.find(this.owner, spy);
      expect(spy).to.not.have.been.called;
    });

    it('calls predicate for every item till true is returned', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      const stub = sinon.stub();
      stub.onSecondCall().returns(true);
      Lill.find(this.owner, stub);
      expect(stub).to.have.been.calledTwice;
      expect(stub.firstCall.args).to.eql([this.firstItem, 0]);
      expect(stub.secondCall.args).to.eql([this.secondItem, 1]);
    });

    it('returns item that fulfills predicate', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      const stub = sinon.stub();
      stub.onThirdCall().returns(true);
      const result = Lill.find(this.owner, stub);
      expect(result).to.equal(this.thirdItem);
    });

    it('returns null if predicate is not fulfilled', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      const stub = sinon.stub();
      stub.returns(false);
      stub.onFirstCall().returns(void 0);
      const result = Lill.find(this.owner, stub);
      expect(result).to.equal(null);
    });

    it('skips calling predicate for items added during iteration', function() {
      let called = 0;
      this.add(this.firstItem);
      Lill.find(this.owner, () => {
        called += 1;
        this.add(this.secondItem);
        return true;
      });
      expect(called).to.equal(1);
    });

    it('optionally accepts third argument being context for the predicate function', function() {
      const spy = sinon.spy();
      const ctx = {};
      this.add(this.firstItem);
      Lill.find(this.owner, spy, ctx);
      expect(spy).to.be.calledOn(ctx);
    });
  });

  it('should respond to iterate method', function() {
    expect(Lill).to.respondTo('iterate');
  });

  describe('iterate()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('iterate');
    });

    it('returns iterable object', function() {
      const iterable = Lill.iterate(this.owner);
      expect(iterable).to.be.an('object');
      expect(iterable[Symbol.iterator]).to.be.an('function');
    });

    it('iterates over linked items', function() {
      const expectIterable = (items) => {
        const actual = Array.from(Lill.iterate(this.owner));
        expect(actual).to.eql(items);
      }

      expectIterable([]);

      this.add(this.firstItem);
      expectIterable([this.firstItem]);

      this.add(this.secondItem);
      expectIterable([this.firstItem, this.secondItem]);

      this.remove(this.firstItem);
      expectIterable([this.secondItem]);
    });

  });

  it('should respond to getSize method', function() {
    expect(Lill).to.respondTo('getSize');
  });

  describe('getSize()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('getSize');
    });

    it('returns number of items in the list', function() {
      expect(Lill.getSize(this.owner)).to.equal(0);
    });
  });

  it('should respond to clear method', function() {
    expect(Lill).to.respondTo('clear');
  });

  describe('clear()', function() {

    it('expects attached object in first argument', function() {
      expectAttached('clear');
    });

    it('removes all items from the list', function() {
      this.add(this.firstItem);
      this.add(this.thirdItem);
      this.add(this.secondItem);
      Lill.clear(this.owner);
      expect(this.size()).to.equal(0);
      expect(Lill.has(this.owner, this.secondItem)).to.be["false"];
      expect(this.head()).to.not.be.ok;
    });
  });

  it('should respond to detach method', function() {
    expect(Lill).to.respondTo('detach');
  });

  describe('detach()', function() {

    it('ignores object that attached', function() {
      expect(function() {
        Lill.detach({});
      }).to.not["throw"];
    });

    it('allows to attach owner object again', function() {
      Lill.detach(this.owner);
      Lill.attach(this.owner);
    });
  });

  it('should respond to isAttached method', function() {
    expect(Lill).to.respondTo('isAttached');
  });

  describe('isAttached()', function() {

    it('returns true for object attached by Lill', function() {
      var obj = Lill.attach({});
      expect(Lill.isAttached(obj)).to.be["true"];
    });

    it('returns false for object not attached by Lill', function() {
      var obj = {};
      expect(Lill.isAttached(obj)).to.be["false"];
    });

  });
});

// ---
// generated by coffee-script 1.9.2