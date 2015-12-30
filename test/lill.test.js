var Lill, chai, expect, sinon;

chai = chai || require('chai');

expect = chai.expect;

sinon = require('sinon');

chai.use(require('sinon-chai'));

Lill = require('../lib/lill');

describe('Lill', function() {
  var expectAttached, expectItem;
  it('should be a object', function() {
    return expect(Lill).to.be.an("object");
  });
  it('should respond to attach method', function() {
    return expect(Lill).to.respondTo('attach');
  });
  describe('attach()', function() {
    it('expects object in first argument argument', function() {
      var toThrow;
      toThrow = function(msg, fn) {
        return expect(fn).to["throw"](TypeError, /needs an object/, msg);
      };
      toThrow('void', function() {
        return Lill.attach();
      });
      toThrow('null', function() {
        return Lill.attach(null);
      });
      toThrow('number', function() {
        return Lill.attach(1);
      });
      toThrow('bool', function() {
        return Lill.attach(false);
      });
      return toThrow('string', function() {
        return Lill.attach('nothing');
      });
    });
    it('expect passed object to be extensible', function() {
      var toThrow;
      toThrow = function(msg, fn) {
        return expect(fn).to["throw"](TypeError, /needs extensible object/, msg);
      };
      toThrow('prevented', function() {
        return Lill.attach(Object.preventExtensions({}));
      });
      toThrow('sealed', function() {
        return Lill.attach(Object.seal({}));
      });
      return toThrow('frozen', function() {
        return Lill.attach(Object.freeze({}));
      });
    });
    return it('forbids to use already attached object', function() {
      var attached;
      attached = Lill.attach({});
      return expect(function() {
        return Lill.attach(attached);
      }).to["throw"](TypeError, /already attached/);
    });
  });
  expectAttached = function(fnName) {
    return expect(function() {
      return Lill[fnName]({});
    }).to["throw"](TypeError, /attach/);
  };
  expectItem = function(owner, fnName) {
    var toThrow, toThrow2;
    toThrow = function(msg, fn) {
      return expect(fn).to["throw"](TypeError, /needs an object or function/, msg);
    };
    toThrow('void', function() {
      return Lill[fnName](owner);
    });
    toThrow('null', function() {
      return Lill[fnName](owner, null);
    });
    toThrow('number', function() {
      return Lill[fnName](owner, 1);
    });
    toThrow('bool', function() {
      return Lill[fnName](owner, false);
    });
    toThrow('string', function() {
      return Lill[fnName](owner, 'nothing');
    });
    toThrow2 = function(msg, fn) {
      return expect(fn).to["throw"](TypeError, /needs an extensible item/, msg);
    };
    toThrow2('prevented', function() {
      return Lill[fnName](owner, Object.preventExtensions({}));
    });
    toThrow2('sealed', function() {
      return Lill[fnName](owner, Object.seal({}));
    });
    return toThrow2('frozen', function() {
      return Lill[fnName](owner, Object.freeze({}));
    });
  };
  beforeEach(function() {
    this.owner = {};
    Lill.attach(this.owner);
    this.firstItem = {
      first: true
    };
    this.secondItem = {
      second: true
    };
    this.thirdItem = {
      third: true
    };
    this.add = (function(_this) {
      return function(item) {
        return Lill.add(_this.owner, item);
      };
    })(this);
    this.remove = (function(_this) {
      return function(item) {
        return Lill.remove(_this.owner, item);
      };
    })(this);
    this.head = (function(_this) {
      return function() {
        return Lill.getHead(_this.owner);
      };
    })(this);
    this.tail = (function(_this) {
      return function() {
        return Lill.getTail(_this.owner);
      };
    })(this);
    this.next = (function(_this) {
      return function(item) {
        return Lill.getNext(_this.owner, item);
      };
    })(this);
    this.prev = (function(_this) {
      return function(item) {
        return Lill.getPrevious(_this.owner, item);
      };
    })(this);
    return this.size = (function(_this) {
      return function() {
        return Lill.getSize(_this.owner);
      };
    })(this);
  });
  it('should respond to add method', function() {
    return expect(Lill).to.respondTo('add');
  });
  describe('add()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('add');
    });
    it('expects extensible object to add in second argument', function() {
      return expectItem(this.owner, 'add');
    });
    it('returns owner object', function() {
      return expect(this.add(this.firstItem)).to.equal(this.owner);
    });
    it('ignores item that is already on list', function() {
      this.add(this.firstItem);
      this.add(this.firstItem);
      return expect(this.size()).to.equal(1);
    });
    it('allows to add item to multiple different lists', function() {
      var owner2, owner3;
      owner2 = Lill.attach({
        owner: 2
      });
      owner3 = Lill.attach({
        owner: 3
      });
      this.add(this.firstItem);
      Lill.add(owner2, this.firstItem);
      Lill.add(owner3, this.firstItem);
      expect(Lill.getSize(this.owner)).to.equal(1);
      expect(Lill.getHead(owner2)).to.equal(this.firstItem);
      Lill.add(owner3, this.secondItem);
      return expect(Lill.getNext(owner3, this.firstItem)).to.equal(this.secondItem);
    });
    it('sets head to first added item', function() {
      this.add(this.firstItem);
      return expect(this.head()).to.equal(this.firstItem);
    });
    it('sets tail to last added item', function() {
      this.add(this.firstItem);
      expect(this.tail()).to.equal(this.firstItem);
      this.add(this.secondItem);
      expect(this.tail()).to.equal(this.secondItem);
      this.add(this.thirdItem);
      return expect(this.tail()).to.equal(this.thirdItem);
    });
    it('increases size for every unique item added', function() {
      this.add(this.firstItem);
      expect(this.size()).to.equal(1);
      this.add(this.secondItem);
      return expect(this.size()).to.equal(2);
    });
    it('sets next and previous of item to null for single item present', function() {
      this.add(this.firstItem);
      expect(this.next(this.firstItem)).to.equal(null);
      return expect(this.prev(this.firstItem)).to.equal(null);
    });
    it('sets next of item to following item', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      expect(this.next(this.firstItem)).to.equal(this.secondItem);
      expect(this.next(this.secondItem)).to.equal(null);
      this.add(this.thirdItem);
      expect(this.next(this.secondItem)).to.equal(this.thirdItem);
      return expect(this.next(this.thirdItem)).to.equal(null);
    });
    return it('sets prev of item to previous item', function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      expect(this.prev(this.firstItem)).to.equal(null);
      expect(this.prev(this.secondItem)).to.equal(this.firstItem);
      this.add(this.thirdItem);
      return expect(this.prev(this.thirdItem)).to.equal(this.secondItem);
    });
  });
  it('should respond to has method', function() {
    return expect(Lill).to.respondTo('has');
  });
  describe('has()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('has');
    });
    it('expects extensible object to check in second argument', function() {
      return expectItem(this.owner, 'has');
    });
    return it('returns boolean to reflect if item is on the list', function() {
      expect(Lill.has(this.owner, this.firstItem)).to.be["false"];
      this.add(this.secondItem);
      return expect(Lill.has(this.owner, this.secondItem)).to.be["true"];
    });
  });
  it('should respond to remove method', function() {
    return expect(Lill).to.respondTo('remove');
  });
  describe('remove()', function() {
    beforeEach(function() {
      this.add(this.firstItem);
      this.add(this.secondItem);
      return this.add(this.thirdItem);
    });
    it('expects attached object in first argument', function() {
      return expectAttached('remove');
    });
    it('expects extensible object to remove in second argument', function() {
      return expectItem(this.owner, 'remove');
    });
    it('returns owner object', function() {
      return expect(this.remove(this.firstItem)).to.equal(this.owner);
    });
    it('silently ignores item that is on the list', function() {
      this.remove(this.firstItem);
      this.remove(this.firstItem);
      return expect(this.size()).to.equal(2);
    });
    it('sets head to next item when previous is removed', function() {
      this.remove(this.firstItem);
      expect(this.head()).to.equal(this.secondItem);
      this.remove(this.secondItem);
      expect(this.head()).to.equal(this.thirdItem);
      this.remove(this.thirdItem);
      return expect(this.head()).to.equal(null);
    });
    it('sets tail to previous item when next one is removed', function() {
      this.remove(this.thirdItem);
      expect(this.tail()).to.equal(this.secondItem);
      this.remove(this.secondItem);
      expect(this.tail()).to.equal(this.firstItem);
      this.remove(this.firstItem);
      return expect(this.tail()).to.equal(null);
    });
    it('decreases size for every removed item', function() {
      expect(this.size()).to.equal(3);
      this.remove(this.firstItem);
      expect(this.size()).to.equal(2);
      this.remove(this.secondItem);
      expect(this.size()).to.equal(1);
      this.remove(this.thirdItem);
      return expect(this.size()).to.equal(0);
    });
    it('removes next and prev from removed item', function() {
      this.remove(this.secondItem);
      expect(this.next(this.secondItem)).to.not.be.ok;
      return expect(this.prev(this.secondItem)).to.not.be.ok;
    });
    it('sets next of previous item to removed item\'s next', function() {
      var extraItem;
      this.add(extraItem = {
        extra: true
      });
      this.remove(this.secondItem);
      expect(this.next(this.firstItem)).to.equal(this.thirdItem);
      this.remove(this.thirdItem);
      return expect(this.next(this.firstItem)).to.equal(extraItem);
    });
    return it('sets prev of next item to removed item\'s previous', function() {
      var extraItem;
      this.add(extraItem = {
        extra: true
      });
      this.remove(this.thirdItem);
      expect(this.prev(extraItem)).to.equal(this.secondItem);
      this.remove(this.secondItem);
      return expect(this.prev(extraItem)).to.equal(this.firstItem);
    });
  });
  it('should respond to getHead method', function() {
    return expect(Lill).to.respondTo('getHead');
  });
  describe('getHead()', function() {
    return it('expects attached object in first argument', function() {
      return expectAttached('getHead');
    });
  });
  it('should respond to getTail method', function() {
    return expect(Lill).to.respondTo('getTail');
  });
  describe('getTail()', function() {
    return it('expects attached object in first argument', function() {
      return expectAttached('getTail');
    });
  });
  it('should respond to getNext method', function() {
    return expect(Lill).to.respondTo('getNext');
  });
  describe('getNext()', function() {
    return it('expects attached object in first argument', function() {
      return expectAttached('getNext');
    });
  });
  it('should respond to getPrevious method', function() {
    return expect(Lill).to.respondTo('getPrevious');
  });
  describe('getPrevious()', function() {
    return it('expects attached object in first argument', function() {
      return expectAttached('getPrevious');
    });
  });
  it('should respond to each method', function() {
    return expect(Lill).to.respondTo('each');
  });
  describe('each()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('each');
    });
    it('expects callback function in second argument', function() {
      var owner, toThrow;
      owner = this.owner;
      toThrow = function(msg, fn) {
        return expect(fn).to["throw"](TypeError, /callback function/, msg);
      };
      toThrow('void', function() {
        return Lill.each(owner);
      });
      toThrow('null', function() {
        return Lill.each(owner, null);
      });
      toThrow('number', function() {
        return Lill.each(owner, 1);
      });
      toThrow('bool', function() {
        return Lill.each(owner, true);
      });
      toThrow('string', function() {
        return Lill.each(owner, 'nothing');
      });
      toThrow('string', function() {
        return Lill.each(owner, {});
      });
      return toThrow('string', function() {
        return Lill.each(owner, []);
      });
    });
    it('callback is not called if list is empty', function() {
      var spy;
      spy = sinon.spy();
      Lill.each(this.owner, spy);
      return expect(spy).to.not.have.been.called;
    });
    it('calls callback for every item in the list in order', function() {
      var spy;
      this.add(this.firstItem);
      this.add(this.secondItem);
      spy = sinon.spy();
      Lill.each(this.owner, spy);
      expect(spy).to.have.been.calledTwice;
      expect(spy.firstCall.args).to.eql([this.firstItem, 0]);
      expect(spy.secondCall.args).to.eql([this.secondItem, 1]);
      this.add(this.thirdItem);
      spy.reset();
      Lill.each(this.owner, spy);
      return expect(spy.thirdCall.args).to.eql([this.thirdItem, 2]);
    });
    it('avoids iterating items if list is changed during iteration', function() {
      var called;
      this.add(this.firstItem);
      called = 0;
      Lill.each(this.owner, (function(_this) {
        return function() {
          called += 1;
          return _this.add(_this.secondItem);
        };
      })(this));
      return expect(called).to.equal(1);
    });
    return it('optionally accepts third argument being context for the callback function', function() {
      var ctx, spy;
      this.add(this.firstItem);
      spy = sinon.spy();
      Lill.each(this.owner, spy, ctx = {});
      return expect(spy).to.be.calledOn(ctx);
    });
  });
  it('should respond to find method', function() {
    return expect(Lill).to.respondTo('find');
  });
  describe('find()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('find');
    });
    it('expects predicate function in second argument', function() {
      var owner, toThrow;
      owner = this.owner;
      toThrow = function(msg, fn) {
        return expect(fn).to["throw"](TypeError, /predicate function/, msg);
      };
      toThrow('void', function() {
        return Lill.find(owner);
      });
      toThrow('null', function() {
        return Lill.find(owner, null);
      });
      toThrow('number', function() {
        return Lill.find(owner, 1);
      });
      toThrow('bool', function() {
        return Lill.find(owner, true);
      });
      toThrow('string', function() {
        return Lill.find(owner, 'nothing');
      });
      toThrow('string', function() {
        return Lill.find(owner, {});
      });
      return toThrow('string', function() {
        return Lill.find(owner, []);
      });
    });
    it('predicate is not called if list is empty', function() {
      var spy;
      spy = sinon.spy();
      Lill.find(this.owner, spy);
      return expect(spy).to.not.have.been.called;
    });
    it('calls predicate for every item till true is returned', function() {
      var stub;
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      stub = sinon.stub();
      stub.onSecondCall().returns(true);
      Lill.find(this.owner, stub);
      expect(stub).to.have.been.calledTwice;
      expect(stub.firstCall.args).to.eql([this.firstItem, 0]);
      return expect(stub.secondCall.args).to.eql([this.secondItem, 1]);
    });
    it('returns item that fulfills predicate', function() {
      var result, stub;
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      stub = sinon.stub();
      stub.onThirdCall().returns(true);
      result = Lill.find(this.owner, stub);
      return expect(result).to.equal(this.thirdItem);
    });
    it('returns null if predicate is not fulfilled', function() {
      var result, stub;
      this.add(this.firstItem);
      this.add(this.secondItem);
      this.add(this.thirdItem);
      stub = sinon.stub();
      stub.returns(false);
      stub.onFirstCall().returns(void 0);
      result = Lill.find(this.owner, stub);
      return expect(result).to.equal(null);
    });
    it('skips calling predicate for items added during iteration', function() {
      var called;
      this.add(this.firstItem);
      called = 0;
      Lill.find(this.owner, (function(_this) {
        return function() {
          called += 1;
          _this.add(_this.secondItem);
          return true;
        };
      })(this));
      return expect(called).to.equal(1);
    });
    return it('optionally accepts third argument being context for the predicate function', function() {
      var ctx, spy;
      this.add(this.firstItem);
      spy = sinon.spy();
      Lill.find(this.owner, spy, ctx = {});
      return expect(spy).to.be.calledOn(ctx);
    });
  });
  it('should respond to getSize method', function() {
    return expect(Lill).to.respondTo('getSize');
  });
  describe('getSize()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('getSize');
    });
    return it('returns number of items in the list', function() {
      return expect(Lill.getSize(this.owner)).to.equal(0);
    });
  });
  it('should respond to clear method', function() {
    return expect(Lill).to.respondTo('clear');
  });
  describe('clear()', function() {
    it('expects attached object in first argument', function() {
      return expectAttached('clear');
    });
    return it('removes all items from the list', function() {
      this.add(this.firstItem);
      this.add(this.thirdItem);
      this.add(this.secondItem);
      Lill.clear(this.owner);
      expect(this.size()).to.equal(0);
      expect(Lill.has(this.owner, this.secondItem)).to.be["false"];
      return expect(this.head()).to.not.be.ok;
    });
  });
  it('should respond to detach method', function() {
    return expect(Lill).to.respondTo('detach');
  });
  describe('detach()', function() {
    it('ignores object that attached', function() {
      return expect(function() {
        return Lill.detach({});
      }).to.not["throw"];
    });
    return it('allows to attach owner object again', function() {
      Lill.detach(this.owner);
      return Lill.attach(this.owner);
    });
  });
  it('should respond to isAttached method', function() {
    return expect(Lill).to.respondTo('isAttached');
  });
  return describe('isAttached()', function() {
    it('returns true for object attached by Lill', function() {
      var obj;
      obj = Lill.attach({});
      return expect(Lill.isAttached(obj)).to.be["true"];
    });
    return it('returns false for object not attached by Lill', function() {
      var obj;
      obj = {};
      return expect(Lill.isAttached(obj)).to.be["false"];
    });
  });
});

// ---
// generated by coffee-script 1.9.2